import React, { useState } from 'react';
import AuthLayout from '@/components/layout/auth/AuthLayout/AuthLayout';
import AuthHeader from '@/components/layout/auth/AuthHeader/AuthHeader';
import AuthInput from '@/components/ui/auth/AuthInput/AuthInput';
import AuthSubmitButton from '@/components/ui/auth/AuthSubmitButton/AuthSubmitButton';
import AuthTextLink from '@/components/ui/auth/AuthTextLink/AuthTextLink';
import AuthFeedback from '@/components/ui/auth/AuthFeedback/AuthFeedback';
import AuthActions from '@/components/ui/auth/AuthActions/AuthActions';
import {
  login,
  registerWithVerification,
  getAuthErrorMessage,
} from '@/firebase/client/auth.js';

/**
 * ログイン/登録画面の各ページの使いまわしコンポーネント。
 */
const Auth = () => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await registerWithVerification(email, password);
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="ミニメモ"
        subtitle={mode === 'login' ? 'ログイン' : '新規登録'}
      />
      {/*入力するのでform要素を使用*/}
      <AuthActions as="form" onSubmit={handleSubmit}>
        {/*メールアドレスの入力項目コンポーネント設置*/}
        <AuthInput
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        {/*パスワードの入力項目コンポーネント設置*/}
        <AuthInput
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />

        {/*エラーメッセージを表示させる。(返ってきた{error}のメッセージ内容が表示される。)*/}
        <AuthFeedback type="error">{error}</AuthFeedback>

        {/*ログインボタンコンポーネント設置*/}
        <AuthSubmitButton
          label={mode === 'login' ? 'ログイン' : '登録する'}
          disabled={submitting}
        />

        {/*hintで緑色のメッセージで囲ったメッセージを表示させる。(登録時のみ表示される。)*/}
        {mode === 'register' && (
          <AuthFeedback type="hint">
            登録後、確認メールが送信されます。メール内のリンクをクリックして認証を完了してください。
          </AuthFeedback>
        )}
      </AuthActions>
      {/*ログインボタンと登録ボタンを切り替えるテキストリンクを表示させる。*/}
      <AuthTextLink onClick={toggleMode}>
        {mode === 'login'
          ? 'アカウントをお持ちでない方はこちら'
          : 'すでにアカウントをお持ちの方はこちら'}
      </AuthTextLink>
    </AuthLayout>
  );
};

export default Auth;
