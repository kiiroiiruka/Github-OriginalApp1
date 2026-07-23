/**
 * 【新規登録フロー ③ パスワード設定画面】
 *
 * 呼び出し元:
 *   - App.jsx（/complete-registration ルート）
 *   - メール内リンク: /complete-registration?token=xxx
 *
 * 使うもの:
 *   - registration.js → openPasswordEntryWindow()（残り5分にリセット）
 *   - registration.js → subscribeRegistrationSession()（Firestore 監視）
 *   - registration.js → finishRegistration()（本登録 + ログイン）
 *
 * 流れ:
 *   1. openPasswordEntryWindow → extend-registration API
 *   2. subscribeRegistrationSession で残り時間を監視
 *   3. パスワード送信 → finishRegistration → complete-registration API
 *   4. Firebase Auth にユーザー作成 → 自動ログイン → メイン画面へ
 */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthHeader from "@/components/layout/auth/AuthHeader/AuthHeader";
import AuthLayout from "@/components/layout/auth/AuthLayout/AuthLayout";
import AuthActions from "@/components/ui/auth/AuthActions/AuthActions";
import AuthFeedback from "@/components/ui/auth/AuthFeedback/AuthFeedback";
import AuthInput from "@/components/ui/auth/AuthInput/AuthInput";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton/AuthSubmitButton";
import { getAuthErrorMessage } from "../../../firebase/client/auth.js";
import {
  clearPendingRegistration,
  finishRegistration,
  getPendingRegistration,
  openPasswordEntryWindow,
  subscribeRegistrationSession,
} from "../../../firebase/client/registration.js";
import { savePendingRegistration } from "../../../src/constants/registrationStorage.js";
import RegistrationExpired from "./RegistrationExpired.jsx";

function formatRemainingTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}分${String(seconds).padStart(2, "0")}秒`;
}

//メール確認後にメールリンクからアプリを開き、
//時間制限付きでパスワードを設定する画面
const CompleteRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const pending = getPendingRegistration(); // → registrationStorage.js
  const tokenId = tokenFromUrl ?? pending?.tokenId ?? "";
  //セッションの状態を管理するためのステート
  const [session, setSession] = useState({ status: "loading" });//セッションの状態を管理するためのステート
  
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    //トークンIDが存在しない場合
    if (!tokenId) {
      setSession({ status: "expired" }); //セッションの状態をexpiredに設定
      return;
    }

    let unsubscribe;
    let cancelled = false;

    const init = async () => {
      //もしトークンIDがURLから取得できた場合は、ローカルストレージに保存
      if (tokenFromUrl) {
        savePendingRegistration({
          tokenId: tokenFromUrl,
          email: pending?.email ?? "",
        });
      }

      try {
        // → registration.js → extend-registration API（残り5分にリセット）
        await openPasswordEntryWindow(tokenId);
      } catch (err) {
        //もしキャンセルされていない場合はエラーメッセージをセット
        if (!cancelled) {
          const message = err.message ?? "";
          if (
            message.includes("有効期限") ||
            message.includes("見つかりません")
          ) {
            setSession({ status: "expired" });
          } else {
            setSession({ status: "error" });
          }
        }
        return;
      }

      //もしキャンセルされていた場合はreturn
      if (cancelled) return;

      //キャンセルされていない場合はカウントダウンを開始
      //監視させたいデータのトークンとデータが変化するたびに実行させたい関数を送る。
      // → registration.js → Firestore onSnapshot で仮トークンを監視
      unsubscribe = subscribeRegistrationSession(tokenId, (nextSession) => {
        //送り先でセットした値がここにセットされる。
        setSession(nextSession);
        //もし仮登録データが存在している場合はローカルストレージに保存
        if (nextSession.status === "pending" && nextSession.email) {
          savePendingRegistration({
            tokenId,
            email: nextSession.email,
          });
        }
      });
    };

    init();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [tokenFromUrl, tokenId, pending?.email]);

  useEffect(() => {
    if (session.status !== "pending" || !session.expiresAt) {
      setRemainingSeconds(null);
      return;
    }

    //ーー↓残り時間を管理するためのカウントダウンを開始する。↓ーー
    const updateRemaining = () => {
      const seconds = Math.max(
        0,
        Math.ceil((session.expiresAt.getTime() - Date.now()) / 1000),
      );
      setRemainingSeconds(seconds);
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    //ーー↑残り時間を管理するためのカウントダウンを開始する。↑ーー
    return () => clearInterval(interval);//カウントダウンを停止
  }, [session]);

  //送信ボタンを押した時の処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("パスワードが一致しません");
      return;
    }

    setSubmitting(true);

    try {
      // → registration.js → complete-registration API → auth.js login()
      await finishRegistration({ tokenId, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message ?? getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  //セッションの状態がexpiredかerrorの場合は期限切れ画面を表示
  if (session.status === "expired" || session.status === "error") {
    return (
      //期限切れ画面を表示
      <RegistrationExpired
        onRestart={() => {
          //ローカルストレージをクリア
          clearPendingRegistration();
          //ホーム画面に遷移
          navigate("/", { replace: true });
        }}
      />
    );
  }

  if (session.status === "loading") {
    return (
      <AuthLayout>
        <AuthHeader title="登録を完了する" compact description="確認中..." />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="パスワードを設定"
        compact
        description={
          <>
            <strong>{session.email}</strong> のアカウント登録を完了します。
          </>
        }
      />

      {remainingSeconds !== null && (
        <AuthFeedback type="hint">
          残り {formatRemainingTime(remainingSeconds)}
          以内にパスワードを設定してください。
        </AuthFeedback>
      )}

      <AuthActions as="form" onSubmit={handleSubmit}>
        <AuthInput
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <AuthInput
          label="パスワード（確認）"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <AuthFeedback type="error">{error}</AuthFeedback>

        <AuthSubmitButton label="登録を完了する" disabled={submitting} />
      </AuthActions>
    </AuthLayout>
  );
};

export default CompleteRegistration;
