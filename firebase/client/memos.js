import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config.js";

const LEGACY_STORAGE_KEY = "memo-storage";

const migrationFlagKey = (uid) => `memo-migrated-${uid}`;

const memosCollection = (uid) => collection(db, "users", uid, "memos");

const memoDoc = (uid, memoId) => doc(db, "users", uid, "memos", String(memoId));

const toMemo = (snapshot) => {
  const data = snapshot.data();
  return {
    ...data,
    id: data.id ?? Number(snapshot.id),
  };
};

/** Zustand persist が残した localStorage のメモを読み取る */
export const readLocalLegacyMemos = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
    if (stored?.state?.memos && Array.isArray(stored.state.memos)) {
      return stored.state.memos;
    }
  } catch {
    // 破損データは無視
  }
  return [];
};

export const getMemosFromFirestore = async (uid) => {
  const snapshot = await getDocs(memosCollection(uid));
  return snapshot.docs.map(toMemo);
};

/**
 * 初回のみ localStorage のメモを Firestore へ移行する。
 * Firestore に既にデータがある場合は上書きしない。
 */
export const migrateLocalMemosToFirestore = async (uid) => {
  if (localStorage.getItem(migrationFlagKey(uid))) {
    return;
  }

  const existing = await getMemosFromFirestore(uid);
  if (existing.length > 0) {
    localStorage.setItem(migrationFlagKey(uid), "true");
    return;
  }

  const localMemos = readLocalLegacyMemos();
  if (localMemos.length > 0) {
    const batch = writeBatch(db);
    for (const memo of localMemos) {
      batch.set(memoDoc(uid, memo.id), {
        id: memo.id,
        title: memo.title,
        content: memo.content ?? "",
        deadline: memo.deadline,
        priority: memo.priority,
      });
    }
    await batch.commit();
  }

  localStorage.setItem(migrationFlagKey(uid), "true");
};

export const subscribeMemos = (uid, onChange, onError) =>
  onSnapshot(
    memosCollection(uid),
    (snapshot) => {
      onChange(snapshot.docs.map(toMemo));
    },
    onError,
  );

export const addMemoToFirestore = async (uid, memo) => {
  await setDoc(memoDoc(uid, memo.id), {
    id: memo.id,
    title: memo.title,
    content: memo.content ?? "",
    deadline: memo.deadline,
    priority: memo.priority,
  });
};

export const deleteMemoFromFirestore = async (uid, id) => {
  await deleteDoc(memoDoc(uid, id));
};

export const updateMemoInFirestore = async (uid, updatedMemo) => {
  await setDoc(
    memoDoc(uid, updatedMemo.id),
    {
      id: updatedMemo.id,
      title: updatedMemo.title,
      content: updatedMemo.content ?? "",
      deadline: updatedMemo.deadline,
      priority: updatedMemo.priority,
    },
    { merge: true },
  );
};
