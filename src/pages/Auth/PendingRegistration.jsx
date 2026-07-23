/**
 * 【新規登録フロー ② メール確認待ち画面】
 *
 * 呼び出し元: App.jsx → AuthenticatedApp
 * 使うもの:
 *   - registrationStorage.js（localStorage から token 取得）
 *   - registration.js → subscribeRegistrationSession()（Firestore 監視）
 *   - registration.js → resendRegistrationEmail()（再送時）
 *
 * 流れ:
 *   Firestore の仮トークンを onSnapshot で監視
 *   → 有効: この画面を表示
 *   → 期限切れ: RegistrationExpired.jsx
 *   ユーザーがメールリンクを開く → CompleteRegistration.jsx へ
 */
import { useCallback, useEffect, useState } from "react";
import AuthHeader from "@/components/layout/auth/AuthHeader/AuthHeader";
import AuthLayout from "@/components/layout/auth/AuthLayout/AuthLayout";
import AuthActions from "@/components/ui/auth/AuthActions/AuthActions";
import AuthFeedback from "@/components/ui/auth/AuthFeedback/AuthFeedback";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton/AuthSubmitButton";
import AuthTextLink from "@/components/ui/auth/AuthTextLink/AuthTextLink";
import {
  clearPendingRegistration,
  getPendingRegistration,
  resendRegistrationEmail,
  subscribeRegistrationSession,
} from "../../../firebase/client/registration.js";
import RegistrationExpired from "./RegistrationExpired.jsx";

//メール確認待ち画面(メールを開く前にアプリ上で表示される画面)
const PendingRegistration = () => {
  const pending = getPendingRegistration();
  const [session, setSession] = useState({ status: "loading" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    //トークンIDが存在しない場合は期限切れにセット
    if (!pending?.tokenId) {
      setSession({ status: "expired" });
      return;
    }

    // → registration.js → onSnapshot で Firestore を監視
    const unsubscribe = subscribeRegistrationSession(
      pending.tokenId,
      setSession,
    );
    return unsubscribe;
  }, [pending?.tokenId]);

  const handleResend = async () => {
    const email = session.email ?? pending?.email;
    if (!email) {
      setError("確認メールを再送できません。最初から登録し直してください。");
      return;
    }

    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      // → registration.js → beginRegistration() → start-registration API
      await resendRegistrationEmail(email);
      setMessage("確認メールを再送しました。");
    } catch (err) {
      setError(err.message ?? "確認メールの再送に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };
  //登録をやり直すボタンを押した時の処理
  const handleCancel = useCallback(() => {
    clearPendingRegistration();//ローカルストレージ上のトークンの削除
    window.location.reload();//ページを再読み込み(ログイン画面に遷移される。)
  }, []);

  //仮登録の有効期限がメールを開く前に切れた際に表示される画面
  if (session.status === "expired" || session.status === "error") {
    return <RegistrationExpired onRestart={handleCancel} />;
  }

  const email = session.email ?? pending?.email ?? "";

  return (
    <AuthLayout>
      <AuthHeader
        title="メール確認"
        compact
        description={
          <>
            <strong>{email}</strong> 宛に確認メールを送信しました。
            メール内のリンクをクリックして、パスワードを設定してください。
          </>
        }
      />

      <AuthFeedback type="hint">
        メール内リンクの有効期限は10分です。リンクを開いたあと、パスワード設定は5分以内に完了してください。
        メールが届かない場合は、迷惑メールフォルダもご確認ください。
      </AuthFeedback>

      <AuthFeedback type="success">{message}</AuthFeedback>
      <AuthFeedback type="error">{error}</AuthFeedback>

      <AuthActions>
        <AuthSubmitButton
          label="確認メールを再送"
          onClick={handleResend}
          disabled={submitting || session.status === "loading"}
        />
        <AuthTextLink onClick={handleCancel} compact>
          登録をやり直す
        </AuthTextLink>
      </AuthActions>
    </AuthLayout>
  );
};

export default PendingRegistration;
