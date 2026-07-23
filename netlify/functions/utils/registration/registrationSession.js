/**
 * 【新規登録フロー Firestore 仮トークン管理】
 *
 * 呼び出し元:
 *   - start-registration.js → createRegistrationSession, deleteSessionsByEmail
 *   - extend-registration-session.js → extendRegistrationSessionForPasswordEntry
 *   - complete-registration.js → consumeRegistrationSession, deleteRegistrationSession
 *
 * 保存先: Firestore `registrationSessions/{tokenId}`
 * フロントからは registration.js → onSnapshot で直接監視
 */
import { randomUUID } from "crypto";
import { getFirebaseAdmin } from "../auth/firebaseAdmin.js";

export const REGISTRATION_SESSION_TTL_MS = 10 * 60 * 1000;
export const PASSWORD_ENTRY_TTL_MS = 5 * 60 * 1000;
const COLLECTION = "registrationSessions";

function getDb() {
  return getFirebaseAdmin().firestore();
}

export function isSessionExpired(data) {
  if (!data?.expiresAt) {
    return true;
  }

  const expiresAt = data.expiresAt.toDate?.() ?? new Date(data.expiresAt);
  return expiresAt.getTime() <= Date.now();
}
//タイムアップで削除する関数
export async function deleteSessionsByEmail(email) {
  const snapshot = await getDb()
    .collection(COLLECTION)
    .where("email", "==", email)
    .get();

  await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()));
}

//仮トークンを作成してfirebaseに保持する関数
export async function createRegistrationSession(email) {
  const tokenId = randomUUID(); //ランダムなUUIDを生成
  const now = Date.now(); //現在の時刻を取得
  const expiresAt = new Date(now + REGISTRATION_SESSION_TTL_MS); //有効期限を設定

  //firebaseに保持する
  await getDb()
    .collection(COLLECTION)
    .doc(tokenId)
    .set({
      email,
      createdAt: new Date(now),
      expiresAt,
      passwordWindowStarted: false,
    });

  //returnで保持した内容を返す。
  return { tokenId, email, expiresAt: expiresAt.toISOString() };
}

//トークンIDから仮登録データを取得する関数
//未だ期限が切れていないかの確認で使用する。
export async function getRegistrationSession(tokenId) {
  const doc = await getDb().collection(COLLECTION).doc(tokenId).get();
  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...doc.data() };
}

//トークンIDから仮登録データを削除する関数
export async function deleteRegistrationSession(tokenId) {
  await getDb().collection(COLLECTION).doc(tokenId).delete();
}

//本登録直前に仮登録が有効かをチェックする際に呼ぶ関数。
export async function consumeRegistrationSession(tokenId) {
  const session = await getRegistrationSession(tokenId);
  //仮登録データが存在しない場合
  if (!session) {
    return { ok: false, reason: "not_found" };
  }

  if (isSessionExpired(session)) {
    await deleteRegistrationSession(tokenId);
    return { ok: false, reason: "expired" };
  }

  return { ok: true, session };
}

// パスワード設定画面を開いたとき、残り時間を5分にリセットする（1回だけ）
export async function extendRegistrationSessionForPasswordEntry(tokenId) {
  const session = await getRegistrationSession(tokenId);
  if (!session) {
    return { ok: false, reason: "not_found" };
  }

  if (isSessionExpired(session)) {
    await deleteRegistrationSession(tokenId);
    return { ok: false, reason: "expired" };
  }

  if (session.passwordWindowStarted) {
    const expiresAt =
      session.expiresAt.toDate?.() ?? new Date(session.expiresAt);
    return {
      ok: true,
      expiresAt: expiresAt.toISOString(),
      extended: false,
    };
  }

  const expiresAt = new Date(Date.now() + PASSWORD_ENTRY_TTL_MS);
  await getDb().collection(COLLECTION).doc(tokenId).update({
    expiresAt,
    passwordWindowStarted: true,
  });

  return {
    ok: true,
    expiresAt: expiresAt.toISOString(),
    extended: true,
  };
}
