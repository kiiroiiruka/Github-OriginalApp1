// components/ui/TabButtons/TabButtons.jsx
import React from 'react';
import styles from './TabButtons.module.css'; //モジュールCSSでスタイル管理

const TabButtons = ({ options, selected, onSelect, labelMap = {} }) => {
    //引数から受け取ったオプションデータをmapメソッドで一つずつ取り出して、button要素を作成して表示させる。
    return (
        <div className={styles.container}>
            {options.map((option) => (
                <button
                    key={option}
                    className={`${styles.button} ${selected === option ? styles.active : ''}`}
                    onClick={() => onSelect(option)}
                >
                    {labelMap[option] || option}
                </button>
            ))}
        </div>
    );
};

export default TabButtons;
