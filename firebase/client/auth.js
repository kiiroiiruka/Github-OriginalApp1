import {
  applyActionCode,
  onAuthStateChanged,
  reload,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { sendVerificationEmail } from "../../src/api/sendVerificationEmail.js";
import { auth } from "../config.js";

export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// 旧フローで作成された未認証ユーザー向け
export const resendVerificationEmail = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("ログインしていません");
  const idToken = await user.getIdToken();
  await sendVerificationEmail(idToken);
};

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

export const reloadUser = () => {
  const user = auth.currentUser;
  if (!user) return Promise.resolve(null);
  return reload(user).then(() => auth.currentUser);
};

export const logout = () => signOut(auth);

export const subscribeAuth = (callback) => onAuthStateChanged(auth, callback);

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
