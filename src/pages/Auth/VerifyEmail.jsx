import { useCallback, useEffect, useState } from "react";
import AuthHeader from "@/components/layout/auth/AuthHeader/AuthHeader";
import AuthLayout from "@/components/layout/auth/AuthLayout/AuthLayout";
import AuthActions from "@/components/ui/auth/AuthActions/AuthActions";
import AuthFeedback from "@/components/ui/auth/AuthFeedback/AuthFeedback";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton/AuthSubmitButton";
import AuthTextLink from "@/components/ui/auth/AuthTextLink/AuthTextLink";
import { useAuth } from "@/context/auth/useAuth";
import {
  getAuthErrorMessage,
  logout,
  resendVerificationEmail,
} from "../../../firebase/client/auth.js";

/**
 * App.jsx で useAuth() の値を見て、
 * ログイン済みかつメール認証済みのときにこの画面を表示する。
 */
const VerifyEmail = () => {
  const { user, refreshUser } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /*
    メール認証状態を確認する関数
  */
  const checkVerification = useCallback(async () => {
    try {
      const updatedUser = await refreshUser();
      if (!updatedUser?.emailVerified) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, [refreshUser]);

  useEffect(() => {
    checkVerification(); //メール認証状態を確認する(初回3秒前に実行)

    //3秒ごとにメール認証状態を確認する(初回3秒後に定期的に実行)
    const interval = setInterval(checkVerification, 3000);

    /*
      そのブラウザのタブ（またはウィンドウ）がアクティブ
      になった瞬間にメール認証状態を確認する。
    */
    const onFocus = () => checkVerification();
    window.addEventListener("focus", onFocus);

    /*
      returnでページ移動時に定期的に実行している関数を削除する。
    */
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [checkVerification]);

  /*
    確認メールを再送する関数
  */
  const handleResend = async () => {
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      await resendVerificationEmail();
      setMessage("確認メールを再送しました。");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  /*
    メール認証状態を確認する関数
  */
  const handleCheckVerification = async () => {
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const verified = await checkVerification();
      if (!verified) {
        setError(
          "まだメール認証が完了していません。メール内のリンクをクリックしてください。届いていない場合は迷惑メールフォルダもご確認ください。",
        );
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  /*
    ログアウトする関数
  */
  const handleLogout = async () => {
    await logout();
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="メール認証"
        compact
        description={
          <>
            <strong>{user?.email}</strong> 宛に確認メールを送信しました。
            メール内のリンクをクリックすると、アプリ画面に自動で移動します。
          </>
        }
      />

      <AuthFeedback type="hint">
        メールが届かない場合は、迷惑メールフォルダもご確認ください。
        送信元は Firebase（noreply@*.firebaseapp.com）です。
      </AuthFeedback>

      <AuthFeedback type="success">{message}</AuthFeedback>
      <AuthFeedback type="error">{error}</AuthFeedback>
      {/*ここでは入力項目はないのでform要素は使用しない。*/}
      <AuthActions>
        <AuthSubmitButton
          label="認証を確認する"
          onClick={handleCheckVerification}
          disabled={submitting}
        />
        <AuthSubmitButton
          label="確認メールを再送"
          onClick={handleResend}
          disabled={submitting}
        />
        <AuthTextLink onClick={handleLogout} compact>
          別のアカウントでログイン
        </AuthTextLink>
      </AuthActions>
    </AuthLayout>
  );
};

export default VerifyEmail;
