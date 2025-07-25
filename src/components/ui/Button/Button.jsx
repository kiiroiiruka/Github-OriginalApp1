import React from 'react';
import styles from './Button.module.css';

const Button = ({ label, onClick, className = '', disabled = false }) => {
    return (
        <button
            onClick={disabled ? undefined : onClick} // 無効時にはクリック不可
            className={`${styles.btn} ${className} ${disabled ? styles.disabled : ''}`}
            disabled={disabled} // ← HTML上でも無効化
        >
            {label}
        </button>
    );
};

export default Button;
