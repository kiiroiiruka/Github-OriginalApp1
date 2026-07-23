/**
 * 【新規登録フロー API ②】
 * 呼び出し元: registration.js → openPasswordEntryWindow()
 * 次に呼ぶ: POST /api/extend-registration-session → extend-registration-session.js
 */
export async function extendRegistrationSession(tokenId) {
  const response = await fetch("/api/extend-registration-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenId }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "登録セッションの更新に失敗しました");
  }

  return data;
}
