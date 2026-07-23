/**
 * 【新規登録フロー フロント側の司令塔】
 *
 * 画面から呼ばれ、API や Firestore をまとめて使う。
 *
 * beginRegistration()
 *   ← Auth.jsx
 *   → startRegistration.js（API）
 *   → registrationStorage.js（localStorage 保存）
 *
 * openPasswordEntryWindow()
 *   ← CompleteRegistration.jsx
 *   → extendRegistrationSession.js（API）
 *
 * subscribeRegistrationSession()
 *   ← PendingRegistration.jsx / CompleteRegistration.jsx
 *   → Firestore onSnapshot（直接監視）
 *
 * finishRegistration()
 *   ← CompleteRegistration.jsx
 *   → completeRegistration.js（API）
 *   → auth.js login()
 *   → registrationStorage.js（localStorage 削除）
 *
 * resendRegistrationEmail()
 *   ← PendingRegistration.jsx
 *   → beginRegistration() を再度実行
 */
import { doc, onSnapshot } from "firebase/firestore";
import { completeRegistration } from "../../src/api/completeRegistration.js";
import { extendRegistrationSession } from "../../src/api/extendRegistrationSession.js";
import { startRegistration } from "../../src/api/startRegistration.js";
import {
  clearPendingRegistration,
  getPendingRegistration,
  savePendingRegistration,
} from "../../src/constants/registrationStorage.js";
import { db } from "../config.js";
import { login } from "./auth.js";

export { clearPendingRegistration, getPendingRegistration };

// CompleteRegistration.jsx から呼ばれる → extend-registration-session.js
export async function openPasswordEntryWindow(tokenId) {
  await extendRegistrationSession(tokenId);
}

// Auth.jsx から呼ばれる → start-registration.js
export async function beginRegistration(email) {
  const data = await startRegistration(email);
  savePendingRegistration({
    tokenId: data.tokenId,
    email: data.email,
  });
  return data;
}

// CompleteRegistration.jsx から呼ばれる → complete-registration.js → auth.js
export async function finishRegistration({ tokenId, password }) {
  const data = await completeRegistration({ tokenId, password });
  await login(data.email, password);
  clearPendingRegistration();
  return data;
}

//期限切れなのかを監視したいトークンIDとfirestoreの状態が
//目的のトークンIDの仮登録データが期限切れになるかの継続監視
export function subscribeRegistrationSession(tokenId, onChange) {
  //トークン管理セクションのデータを取得
  const ref = doc(db, "registrationSessions", tokenId);
  let expiryTimer;
  //期限切れになるまでのタイマーを管理するための変数

  const clearExpiryTimer = () => {
    if (expiryTimer) {
      clearTimeout(expiryTimer);
      expiryTimer = undefined;
    }
  };

  //データの監視を行うための関数
  const handleSnapshot = (snapshot) => {
    clearExpiryTimer();//期限切れになるまでのタイマーをクリア

    //データがそんざいしない場合は期限切れにセット
    if (!snapshot.exists()) {
      onChange({ status: "expired" });
      return;
    }

    const data = snapshot.data();
    const expiresAt = data.expiresAt?.toDate?.() ?? new Date(data.expiresAt);
    const remainingMs = expiresAt.getTime() - Date.now();

    //期限切れになるまでの時間が0秒以下になった場合は期限切れにセット
    if (remainingMs <= 0) {
      onChange({ status: "expired", email: data.email });
      return;
    }

    //期限切れになるまでの時間が0秒以下になった場合は期限切れにセット
    expiryTimer = setTimeout(() => {
      onChange({ status: "expired", email: data.email });
    }, remainingMs);

    onChange({
      status: "pending",
      email: data.email,
      expiresAt,
    });
  };

  //onSnapshotでトークン管理セクションのデータを監視して、
  //変わるたびにhandleSnapshotを実行、監視が失敗したら
  //status: "error"にセットでタイマーもクリアさせる。
  const unsubscribe = onSnapshot(ref, handleSnapshot, () => {
    clearExpiryTimer();
    onChange({ status: "error" });
  });

  return () => {
    clearExpiryTimer();
    unsubscribe();
  };
}

//メール再送のグローバル関数
export async function resendRegistrationEmail(email) {
  const data = await beginRegistration(email);
  return data;
}
