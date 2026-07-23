/**
 * 【新規登録フロー localStorage 管理】
 *
 * 呼び出し元:
 *   - registration.js（保存・削除）
 *   - App.jsx / PendingRegistration / CompleteRegistration（読み取り）
 *
 * Firebase Auth にログインする前の「仮登録途中」をブラウザに保持する。
 */
const TOKEN_KEY = "minimemo_registration_token";
const EMAIL_KEY = "minimemo_registration_email";

export function savePendingRegistration({ tokenId, email }) {
  localStorage.setItem(TOKEN_KEY, tokenId);
  localStorage.setItem(EMAIL_KEY, email);
}

//ローカルストレージ内に保持している仮登録データを取得する関数
export function getPendingRegistration() {
  const tokenId = localStorage.getItem(TOKEN_KEY);
  const email = localStorage.getItem(EMAIL_KEY);
  if (!tokenId) {
    return null;
  }
  return { tokenId, email };
}

export function clearPendingRegistration() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}
