import React from 'react';
import Header from '@/components/layout/Header/Header';
import VerticalList from '@/components/ui/VerticalList/VerticalList';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { autoDeleteAtom } from '@/atom/autoDeleteAtom'; // autoDeleteAtomをインポート
import CustomCheckbox from '@/components/ui/CustomCheckbox/CustomCheckbox'; // チェックボックスコンポーネント
import useExpiredMemoDeleter from '@/hooks/useExpiredMemoDeleter'; // 自動削除フック
import styles from './MemoHome.module.css'; // CSSモジュールのインポート

const MemoHome = () => {
    const navigate = useNavigate();
    const [autoDelete, setAutoDelete] = useAtom(autoDeleteAtom); // 自動削除の状態を管理
    // 自動削除処理の呼び出し
    useExpiredMemoDeleter();

    // メモリストの優先度を選択した場合の遷移処理
    const handleNavigate = (level) => {
        navigate('/memoList', { state: { level } });
    };

    // トグルボタンの状態を変更するハンドラ
    const handleToggle = (newState) => {
        setAutoDelete(newState); // 自動削除の状態を反転
    };

    const listItems = [
        { label: '高', onClick: () => handleNavigate('高') },
        { label: '中', onClick: () => handleNavigate('中') },
        { label: '低', onClick: () => handleNavigate('低') },
    ];

    return (
        <div className={styles.page}>
            <Header title="メモ" />
            <main className={styles.container}>
                {/* 優先度選択セクション */}
                <div className={styles.prioritySection}>
                    <h2 className={styles.subTitle}>優先度の選択</h2>
                    <VerticalList
                        items={listItems.map((item) => ({
                            ...item,
                            className: styles.listItem,
                        }))}
                    />
                </div>

                {/* 設定セクション */}
                <div className={styles.settingsSection}>
                    <h3>設定</h3>
                    <div className={styles.toggleWrapper}>
                        <label className={styles.toggleLabel}>
                            締切過ぎたメモを自動削除
                        </label>
                        <CustomCheckbox
                            checked={autoDelete}
                            onChange={handleToggle} // 状態の反転
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MemoHome;
