// store/memoStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialMemos } from '@/constants/initialData';  // JSONファイルから初期データをインポート

const useMemoStore = create(
    persist(
        (set) => ({
            memos: [], // 初期状態は空の配列に設定

            // メモのロード
            loadMemos: () => {
                try {
                    //localStorageからmemo-storageというキーで保存されているデータを取得して、storedに代入。
                    const stored = JSON.parse(localStorage.getItem('memo-storage'));
                    if (stored?.state?.memos && Array.isArray(stored.state.memos)) {
                        //メモ内容が保持されていたら、その内容をsetメソッドでmemosに代入。(画面に反映される。)
                        set({ memos: stored.state.memos });
                    } else {
                        //メモ内容が保持されていなかったら、初期データをsetメソッドでmemosに代入。(画面に反映される。)
                        set({ memos: initialMemos });
                    }
                } catch {
                    //エラーが発生した場合、初期データをsetメソッドでmemosに代入。(画面に反映される。)
                    set({ memos: initialMemos });
                }
            },

            // メモ追加
            addMemo: (memo) =>
                set((state) => ({
                    memos: [...state.memos, memo],
                })),

            // メモ削除
            deleteMemo: (id) =>
                set((state) => ({
                    memos: state.memos.filter((memo) => memo.id !== id),
                })),

            // メモ更新
            updateMemo: (updatedMemo) =>
                set((state) => ({
                    memos: state.memos.map((memo) =>
                        memo.title === updatedMemo.title ? updatedMemo : memo
                    ),
                })),

            // 期限切れメモの削除処理
            deleteExpiredMemos: () =>
                set((state) => {
                    const now = new Date();
                    const updatedMemos = state.memos.filter((memo) => new Date(memo.deadline) > now);
                    return { memos: updatedMemos };
                }),

        }),

        {
            name: 'memo-storage', // ローカルストレージのキー名
        }
    )
);

export default useMemoStore;
