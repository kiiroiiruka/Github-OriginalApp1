// hooks/useExpiredMemoDeleter.js
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { autoDeleteAtom } from '@/atom/autoDeleteAtom';  // autoDelete状態をインポート
import useMemoStore from '@/store/useMemoStore';  // Zustandのストアをインポート

const useExpiredMemoDeleter = () => {
    const [flag] = useAtom(autoDeleteAtom);  // 
    const { deleteExpiredMemos } = useMemoStore();  // Zustand内の削除関数

    useEffect(() => {
        if (flag) {
            deleteExpiredMemos();  // 期限切れメモを削除
        }
    }, [flag, deleteExpiredMemos]);  // autoDeleteが変更されたときのみ実行
};

export default useExpiredMemoDeleter;
