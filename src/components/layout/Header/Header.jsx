// components/ui/Header/Header.jsx
import React from 'react';
import styles from './Header.module.css';

const Header = ({ title, onBack }) => {
    return (
        <header className={styles.header}>
            {/* 左端に戻るボタンを表示（onBackが渡された場合のみ） */}
            {onBack && (
                <button className={styles.backButton} onClick={onBack}>
                    ← 戻る
                </button>
            )}
            {/* タイトルは常に中央に配置 */}
            <h1 className={styles.title}>{title}</h1>
        </header>
    );
};

export default Header;
