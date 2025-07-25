import React from 'react';
import styles from './VerticalList.module.css';
import Button from '../Button/Button';

const VerticalList = ({ items }) => {
    if (!items || items.length === 0) {
        return (
            <div className={styles.listContainer}>
                <p className={styles.emptyMessage}>表示内容なし</p>
            </div>
        );
    }

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
