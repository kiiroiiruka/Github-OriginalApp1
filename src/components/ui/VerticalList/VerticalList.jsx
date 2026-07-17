import React from 'react';
import styles from './VerticalList.module.css';
import Button from '../Button/Button';

//引数から全てのメモデータを受け取ってリスト的に表示させるコンポーネント。
const VerticalList = ({ items }) => {
    //受け取ったデータがない場合は「表示内容なし」を表示させる。
    if (!items || items.length === 0) {
        return (
            <div className={styles.listContainer}>
                <p className={styles.emptyMessage}>表示内容なし</p>
            </div>
        );
    }

    //存在していた場合は受け取ったアイテムデータを全て表示させる。
    return (
        <div className={styles.listContainer}>
            {items.map((item, index) => (
                <Button
                    key={index}
                    label={item.label}
                    onClick={item.onClick}
                    className={styles.listItem}
                />
            ))}
        </div>
    );
};

export default VerticalList;
