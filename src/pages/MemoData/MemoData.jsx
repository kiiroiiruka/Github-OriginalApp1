import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useMemoStore from '@/store/useMemoStore';
import Header from '@/components/layout/Header/Header'; // Headerコンポーネントをインポート
import styles from './MemoData.module.css';
import { formatDateTime } from '@/units/formatDate';

const MemoData = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // location.state が存在する場合に selectedIds を取得、それが存在しない場合は空配列
    const selectedIds = location.state?.selectedIds ?? [];

    // メモストアからメモリストを取得
    const memos = useMemoStore((state) => state.memos);

    // selectedIds に含まれる id を持つメモをフィルタリング
    const selectedMemos = memos.filter((memo) => selectedIds.includes(memo.id));

    // メモがない場合、エラーメッセージを表示
    if (selectedMemos.length === 0) {
        return (
            <div className={styles.container}>
                <Header
                    title="メモ内容"
                    onBack={() => navigate(-1)} // 戻るボタンをクリックした時の処理
                />
                <p>選択されたメモはありません。</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Headerに戻るボタンの処理を渡す */}
            <Header
                title="メモ内容"
                onBack={() => navigate(-1)} // 戻るボタンをクリックした時の処理
            />

            {/* メモリストを表示 */}
            <ul className={styles.memoList}>
                {selectedMemos.map((memo) => (
                    <li key={memo.id} className={styles.memoCard}>
                        <h2 className={styles.memoTitle}>{memo.title}</h2>
                        <p className={styles.memoContent}>{memo.content}</p>
                        <p className={`${styles.memoMeta} ${styles.deadline}`}>
                            期限: {formatDateTime(memo.deadline)}
                        </p>
                        <p className={`${styles.memoMeta} ${styles[`priority${memo.priority}`]}`}>
                            優先度: {memo.priority}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MemoData;
