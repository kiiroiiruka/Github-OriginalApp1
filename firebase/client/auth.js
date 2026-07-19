import {
  applyActionCode,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config.js";

const getEmailActionCodeSettings = () => ({
  url: window.location.origin,
  handleCodeInApp: true,
});

// ログイン
export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// 新規登録 + 確認メール送信
export const registerWithVerification = async (email, password) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  await sendEmailVerification(credential.user, getEmailActionCodeSettings());
  return credential.user;
};

// 確認メールを再送
export const resendVerificationEmail = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("ログインしていません");
  await sendEmailVerification(user, getEmailActionCodeSettings());
};

// メール内リンクからアプリに戻ったときに認証を完了する
export const completeEmailVerificationFromUrl = async () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const oobCode = params.get("oobCode");

  if (mode !== "verifyEmail" || !oobCode) return null;

  await applyActionCode(auth, oobCode);
  const updated = await reloadUser();
  window.history.replaceState({}, "", window.location.pathname);
  return updated;
};

// ユーザーの認証状態を再取得（メール確認後に使用）
export const reloadUser = () => {
  const user = auth.currentUser;
  if (!user) return Promise.resolve(null);
  return reload(user).then(() => auth.currentUser);
};

// ログアウト
export const logout = () => signOut(auth);

// ログイン状態の監視
export const subscribeAuth = (callback) => onAuthStateChanged(auth, callback);

// Firebase Auth エラーを日本語メッセージに変換
export const getAuthErrorMessage = (error) => {
  const code = error?.code ?? "";
  const messages = {
    "auth/email-already-in-use": "このメールアドレスは既に登録されています",
    "auth/invalid-email": "メールアドレスの形式が正しくありません",
    "auth/weak-password": "パスワードは6文字以上にしてください",
    "auth/user-not-found": "メールアドレスまたはパスワードが正しくありません",
    "auth/wrong-password": "メールアドレスまたはパスワードが正しくありません",
    "auth/invalid-credential":
      "メールアドレスまたはパスワードが正しくありません",
    "auth/too-many-requests": "しばらく時間をおいてから再度お試しください",
  };
  return messages[code] ?? "エラーが発生しました。もう一度お試しください";
};
