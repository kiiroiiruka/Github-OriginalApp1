import admin from "firebase-admin";

function getPrivateKey() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey) {
    return null;
  }

  return privateKey.replace(/\\n/g, "\n");
}

export function getFirebaseAdmin() {
  //すでにどこかでFirebase Adminを扱ってたらそれを返す
  if (admin.apps.length > 0) {
    return admin;
  }

  //環境変数からFirebaseのプロジェクトID、クライアントメール、秘密鍵を取得
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  //環境変数から取得した値がない場合はエラーを投げる
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin credentials are not configured");
  }

  //Firebase Adminを扱える状態にする。
  //扱える状態にするためには、プロジェクトID、クライアントメール、秘密鍵が必要。
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return admin;
}

//アプリのURLを取得する
//確認メール受け取ったあとアプリに戻る際のアクセス先のURLを取得する
export function getAppUrl() {
  return (
    process.env.APP_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "http://localhost:8888"
  );
}
