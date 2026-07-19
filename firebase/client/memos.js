import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../config.js";

const memosCollection = (uid) => collection(db, "users", uid, "memos");

const memoDoc = (uid, memoId) => doc(db, "users", uid, "memos", String(memoId));

const toMemo = (snapshot) => {
  const data = snapshot.data();
  return {
    ...data,
    id: data.id ?? snapshot.id,
  };
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
  const ref = doc(memosCollection(uid));
  await setDoc(ref, {
    id: ref.id,
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
