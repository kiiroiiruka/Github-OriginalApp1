// hooks/useExpiredMemoDeleter.js
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { autoDeleteAtom } from '@/atom/autoDeleteAtom';  // autoDelete状態をインポート
import useMemoStore from '@/store/useMemoStore';  // Zustandのストアをインポート

const useExpiredMemoDeleter = () => {
    const [flag] = useAtom(autoDeleteAtom);  // autoDeleteの状態を取得
    const { deleteExpiredMemos } = useMemoStore();  // ZustandストアからdeleteExpiredMemos関数を取得

    useEffect(() => {
        if (flag) {
            // autoDeleteが有効な場合にのみ削除処理を実行
            deleteExpiredMemos();  // 期限切れメモを削除
        }
    }, [flag, deleteExpiredMemos]);  // autoDeleteが変更されたときのみ実行
};

export default useExpiredMemoDeleter;
