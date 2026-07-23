export async function sendVerificationEmail(idToken) {
  const response = await fetch("/api/send-verification-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "確認メールの送信に失敗しました");
  }

  return data;
}
