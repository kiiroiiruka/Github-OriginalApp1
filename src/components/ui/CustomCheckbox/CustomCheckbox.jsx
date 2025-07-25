import React from 'react';
import styles from './CustomCheckbox.module.css';

const CustomCheckbox = ({ checked, onChange, label }) => {
    return (
        <div className={styles.checkboxWrapper}>
            {/* Checkbox container with click event */}
            <div
                onClick={() => onChange(!checked)}
                className={`${styles.checkboxContainer} ${checked ? styles.checked : ''}`}
                aria-checked={checked}
            >
                {/* The checkedInner div only appears if the checkbox is checked */}
                <div className={styles.checkedInner}>
                    {/* Green checkmark when unchecked, white checkmark when checked */}
                    <span className={styles.checkmark}>✓</span>
                </div>
            </div>

            {/* Label for the checkbox */}
            <span className={styles.checkboxText}>{label}</span>
        </div>
    );
};

export default CustomCheckbox;
