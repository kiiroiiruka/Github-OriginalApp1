import React, { useState } from 'react';
import Button from '@/components/ui/Button/Button';
import SelectableVerticalList from '@/components/ui/SelectableVerticalList/SelectableVerticalList';
import useMemoStore from '@/store/useMemoStore';
import { filterAndSortMemos } from '@/units/memoUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header/Header';
import { formatDateTime } from '@/units/formatDate';  // formatDateTimeをインポート
import styles from './MemoList.module.css';
import Footer from '@/components/layout/Footer/Footer';

const MemoList = () => {
    const location = useLocation();
    const level = location.state?.level;
    const navigate = useNavigate();
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const memos = useMemoStore(state => state.memos);
    const deleteMemo = useMemoStore(state => state.deleteMemo);

    const filteredMemos = filterAndSortMemos(memos, level);

    const listItems = filteredMemos.map(memo => ({
        label: `${memo.title} <br /> ${formatDateTime(memo.deadline)}`, // formatDateTimeを使用
        id: memo.id,
        checked: selectedIds.includes(memo.id),
    }));

    const handleCheckboxChange = (id, checked) => {
        setSelectedIds(prev =>
            checked ? [...prev, id] : prev.filter(itemId => itemId !== id)
        );
    };

    const handleItemClick = (id) => {
        const selectedMemo = memos.find(m => m.id === id);
        if (selectedMemo) {
            navigate('/memoData', {
                state: { selectedIds: [selectedMemo.id] }
            });
        }
    };

    const handleDelete = () => {
        selectedIds.forEach(id => deleteMemo(id));
        setSelectedIds([]);
        setIsSelecting(false);
    };

    return (
        <div className={styles.container}>
            <Header
                title={`${level} 優先度のメモ`}
                onBack={() => navigate("/memo")}
            />

            <div className={styles.buttonGroup}>
                <Button
                    label={isSelecting ? "キャンセル" : "選択"}
                    onClick={() => {
                        setIsSelecting(!isSelecting);
                        setSelectedIds([]); // 選択モードをキャンセルした場合、選択状態をリセット
                    }}
                />
                <Button
                    label="追加"
                    onClick={() => navigate('/addMemo', { state: { level, priority: level } })}
                />
            </div>

            <div className={styles.scrollableList}>
                <SelectableVerticalList
                    items={listItems}
                    showCheckbox={isSelecting}
                    onCheckboxChange={handleCheckboxChange}
                    onItemClick={handleItemClick}
                />
            </div>

            {isSelecting && selectedIds.length > 0 && (
                <Footer>
                    <div className={styles.deleteContainer}>
                        <Button label="削除する" onClick={handleDelete} />
                    </div>
                </Footer>
            )}
        </div>
    );
};

export default MemoList;
