/**
 * 【新規登録フロー ① ログイン/登録画面】
 *
 * 呼び出し元: App.jsx → AuthenticatedApp（未ログイン時）
 * 次に呼ぶ: firebase/client/registration.js → beginRegistration()
 *
 * 流れ:
 *   メール入力 → beginRegistration() → ページ再読み込み
 *   → App.jsx が localStorage を見て PendingRegistration を表示
 */
import { useState } from "react";
import AuthHeader from "@/components/layout/auth/AuthHeader/AuthHeader";
import AuthLayout from "@/components/layout/auth/AuthLayout/AuthLayout";
import AuthActions from "@/components/ui/auth/AuthActions/AuthActions";
import AuthFeedback from "@/components/ui/auth/AuthFeedback/AuthFeedback";
import AuthInput from "@/components/ui/auth/AuthInput/AuthInput";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton/AuthSubmitButton";
import AuthTextLink from "@/components/ui/auth/AuthTextLink/AuthTextLink";
import { getAuthErrorMessage, login } from "../../../firebase/client/auth.js";
import { beginRegistration } from "../../../firebase/client/registration.js";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
        //ログイン成功したらホーム画面に遷移
      } else {
        // → registration.js → startRegistration API → start-registration.js
        //メールアドレス送る&仮トークン作成&確認メール送る&トークンをローカルストレージに保存
        await beginRegistration(email);
        window.location.reload();//ページを再読み込み(メール確認待ち画面に遷移される。)
      }
    } catch (err) {
      setError(err.message ?? getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError("");
    setPassword("");
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="ミニメモ"
        subtitle={mode === "login" ? "ログイン" : "新規登録"}
      />
      <AuthActions as="form" onSubmit={handleSubmit}>
        <AuthInput
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        {mode === "login" && (
          <AuthInput
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="current-password"
          />
        )}

        <AuthFeedback type="error">{error}</AuthFeedback>

        <AuthSubmitButton
          label={mode === "login" ? "ログイン" : "確認メールを送信"}
          disabled={submitting}
        />

        {mode === "register" && (
          <AuthFeedback type="hint">
            確認メールを送信します。メール内のリンクからパスワードを設定して登録を完了してください。
          </AuthFeedback>
        )}
      </AuthActions>
      <AuthTextLink onClick={toggleMode}>
        {mode === "login"
          ? "アカウントをお持ちでない方はこちら"
          : "すでにアカウントをお持ちの方はこちら"}
      </AuthTextLink>
    </AuthLayout>
  );
};

export default Auth;
