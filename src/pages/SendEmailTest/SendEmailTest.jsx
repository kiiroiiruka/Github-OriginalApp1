import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmail } from "@/api/sendEmail";
import Header from "@/components/layout/Header/Header";
import AuthFeedback from "@/components/ui/auth/AuthFeedback/AuthFeedback";
import AuthInput from "@/components/ui/auth/AuthInput/AuthInput";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton/AuthSubmitButton";
import { useAuth } from "@/context/auth/useAuth";
import styles from "./SendEmailTest.module.css";

const SendEmailTest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [to, setTo] = useState(user?.email ?? "");
  const [subject, setSubject] = useState("ミニメモからのテストメール");
  const [message, setMessage] = useState(
    "Netlify Function から送信されたテストメールです。",
  );
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback("");
    setError("");
    setSubmitting(true);

    try {
      if (!user) {
        throw new Error("ログインしていません");
      }

      const idToken = await user.getIdToken();
      const result = await sendEmail({ to, subject, message }, idToken);
      setFeedback(result.message ?? "メールを送信しました");
    } catch (err) {
      setError(err.message ?? "メールの送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Header title="メール送信テスト" onBack={() => navigate(-1)} />
      <main className={styles.container}>
        <p className={styles.description}>
          Netlify Function（/api/send-email）経由でメールを送信します。
          ローカルでは npm run dev:netlify で起動してください。
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <AuthInput
            label="送信先メールアドレス"
            type="email"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            required
            autoComplete="email"
          />

          <AuthInput
            label="件名"
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
          />

          <label className={styles.textareaLabel}>
            本文
            <textarea
              className={styles.textarea}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              rows={8}
            />
          </label>

          {error && <AuthFeedback type="error">{error}</AuthFeedback>}
          {feedback && <AuthFeedback type="success">{feedback}</AuthFeedback>}

          <AuthSubmitButton
            label={submitting ? "送信中..." : "メールを送信"}
            disabled={submitting}
          />
        </form>
      </main>
    </div>
  );
};

export default SendEmailTest;
