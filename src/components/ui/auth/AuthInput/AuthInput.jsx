import React from 'react';
import styles from './AuthInput.module.css';

const AuthInput = ({
    label,
    type = 'text',
    value,
    onChange,
    required = false,
    minLength,
    autoComplete,
}) => (
    <label className={styles.label}>
        {label}
        <input
            type={type}
            className={styles.input}
            value={value}
            onChange={onChange}
            required={required}
            minLength={minLength}
            autoComplete={autoComplete}
        />
    </label>
);

export default AuthInput;
