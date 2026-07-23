//引数でログイントークンを受け取り有効かどうか確認する関数。
export async function verifyFirebaseToken(idToken) {
  const apiKey = process.env.FIREBASE_API_KEY; //FirebaseのAPIキーを取得する
  if (!apiKey) {
    //FirebaseのAPIキーがない場合はエラーを返す
    throw new Error("FIREBASE_API_KEY is not configured");
  }

  //FirebaseのAPIを呼び出してログイントークンが有効かどうか確認する
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );

  const data = await response.json(); //APIのレスポンスをJSON形式で取得する
  if (!response.ok) {
    return null; //APIのレスポンスが正常でない場合はnullを返す
  }

  return data.users?.[0] ?? null; //APIのレスポンスからユーザー情報を取得する
}
