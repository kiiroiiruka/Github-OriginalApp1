// components/ui/TabButtons/TabButtons.jsx
import React from 'react';
import styles from './TabButtons.module.css'; // 任意：モジュールCSSでスタイル管理

const TabButtons = ({ options, selected, onSelect, labelMap = {} }) => {
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
