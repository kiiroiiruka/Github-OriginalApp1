/**
 * 【新規登録フロー API ③】
 * 呼び出し元: registration.js → finishRegistration()
 * 次に呼ぶ: POST /api/complete-registration → complete-registration.js
 */
export async function completeRegistration({ tokenId, password }) {
  const response = await fetch("/api/complete-registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenId, password }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "アカウント登録に失敗しました");
  }

  return data;
}
