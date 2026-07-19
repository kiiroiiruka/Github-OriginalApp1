import { create } from "zustand";
import {
  addMemoToFirestore,
  deleteMemoFromFirestore,
  subscribeMemos,
  updateMemoInFirestore,
} from "../../firebase/client/memos.js";

const useMemoStore = create((set, get) => ({
  memos: [],
  loading: false,
  userId: null,
  unsubscribe: null,

  initMemosForUser: async (uid) => {
    const { unsubscribe } = get();
    if (unsubscribe) unsubscribe();

    set({ userId: uid, loading: true, memos: [] });

    const unsub = subscribeMemos(
      uid,
      (memos) => set({ memos, loading: false }),
      (error) => {
        console.error("メモの取得に失敗しました:", error);
        set({ loading: false });
      },
    );

    set({ unsubscribe: unsub });
    return unsub;
  },

  clearMemos: () => {
    const { unsubscribe } = get();
    if (unsubscribe) unsubscribe();
    set({ memos: [], loading: false, userId: null, unsubscribe: null });
  },

  addMemo: async (memo) => {
    const { userId } = get();
    if (!userId) return;
    await addMemoToFirestore(userId, memo);
  },

  deleteMemo: async (id) => {
    const { userId } = get();
    if (!userId) return;
    await deleteMemoFromFirestore(userId, id);
  },

  updateMemo: async (updatedMemo) => {
    const { userId } = get();
    if (!userId) return;
    await updateMemoInFirestore(userId, updatedMemo);
  },

  deleteExpiredMemos: async () => {
    const { userId, memos } = get();
    if (!userId) return;

    const now = new Date();
    const expired = memos.filter((memo) => new Date(memo.deadline) <= now);
    await Promise.all(
      expired.map((memo) => deleteMemoFromFirestore(userId, memo.id)),
    );
  },
}));

export default useMemoStore;
