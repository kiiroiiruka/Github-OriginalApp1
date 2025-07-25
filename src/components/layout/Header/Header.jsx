import React from 'react';
import styles from './Header.module.css';

const Header = ({ title, onBack, isInputFocused }) => {
    return (
        <header
            className={styles.header}
            style={{
                position: isInputFocused ? 'static' : 'fixed', // 入力中は固定解除
            }}
        >
            {onBack && (
                <button className={styles.backButton} onClick={onBack}>
                    ← 戻る
                </button>
            )}
            <h1 className={styles.title}>{title}</h1>
        </header>
    );
};

export default Header;
