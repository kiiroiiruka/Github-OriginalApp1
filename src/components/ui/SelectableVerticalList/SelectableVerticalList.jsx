import React from 'react';
import CustomCheckbox from '@/components/ui/CustomCheckbox/CustomCheckbox';
import styles from './SelectableVerticalList.module.css'; // モジュールCSSをインポート

const SelectableVerticalList = ({ items, showCheckbox, onCheckboxChange, onItemClick }) => {
    return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map(item => (
                <li
                    key={item.id}
                    className={styles.listItem} // クラス名を適用
                    onClick={() => !showCheckbox && onItemClick?.(item.id)} // ✅ 選択モード中以外のみクリック可
                >
                    {showCheckbox && (
                        <div className={styles.checkboxWrapper}> {/* チェックボックスに隙間を作る */}
                            <CustomCheckbox
                                checked={item.checked} // 親から渡されたcheckedを使用
                                onChange={(checked) => onCheckboxChange(item.id, checked)} // 状態変更を親に伝える
                            />
                        </div>
                    )}
                    <span
                        className={styles.title}  // タイトル部分に適用
                        dangerouslySetInnerHTML={{ __html: item.label }}
                    />
                </li>
            ))}
        </ul>
    );
};

export default SelectableVerticalList;
