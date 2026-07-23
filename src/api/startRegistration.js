/**
 * 【新規登録フロー API ①】
 * 呼び出し元: registration.js → beginRegistration()
 * 次に呼ぶ: POST /api/start-registration → start-registration.js
 */
export async function startRegistration(email) {
  const response = await fetch("/api/start-registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "確認メールの送信に失敗しました");
  }

  return data;
}
