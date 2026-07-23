import AuthHeader from "@/components/layout/auth/AuthHeader/AuthHeader";
import AuthLayout from "@/components/layout/auth/AuthLayout/AuthLayout";
import AuthActions from "@/components/ui/auth/AuthActions/AuthActions";
import AuthFeedback from "@/components/ui/auth/AuthFeedback/AuthFeedback";
import AuthSubmitButton from "@/components/ui/auth/AuthSubmitButton/AuthSubmitButton";

//期限切れ画面(メールを開く前に期限切れた際に表示される画面)
const RegistrationExpired = ({ onRestart }) => (
  <AuthLayout>
    <AuthHeader
      title="登録の有効期限切れ"
      compact
      description="10分以内にメール内のリンクを開かなかったため、仮登録が無効になりました。"
    />

    <AuthFeedback type="hint">
      もう一度メールアドレスを入力して、登録からやり直してください。
    </AuthFeedback>

    <AuthActions>
      <AuthSubmitButton label="スタート画面に戻る" onClick={onRestart} />
    </AuthActions>
  </AuthLayout>
);

export default RegistrationExpired;
