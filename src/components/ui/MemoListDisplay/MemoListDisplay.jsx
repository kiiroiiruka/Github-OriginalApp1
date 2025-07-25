// components/MemoListDisplay.jsx
import React, { useEffect } from 'react';
import useMemoStore from '@/store/useMemoStore';

const MemoListDisplay = () => {
    const { memos, loadMemos } = useMemoStore((state) => ({
        memos: state.memos,
        loadMemos: state.loadMemos,
    }));

    // コンポーネントがマウントされたときにメモをロード
    useEffect(() => {
        loadMemos();
    }, [loadMemos]);

    return (
        <div className="memo-list-container">
            {memos.length > 0 ? (
                memos.map((memo) => (
                    <div key={memo.title} className="memo-item">
                        <h3>{memo.title}</h3>
                        <p>{memo.content}</p>
                    </div>
                ))
            ) : (
                <p>メモがありません。</p>
            )}
        </div>
    );
};

export default MemoListDisplay;
