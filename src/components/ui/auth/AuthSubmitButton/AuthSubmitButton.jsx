import React from 'react';
import Button from '@/components/ui/Button/Button';
import styles from './AuthSubmitButton.module.css';

const AuthSubmitButton = ({ label, disabled = false, onClick }) => (
    <Button
        label={label}
        disabled={disabled}
        onClick={onClick}
        className={styles.button}
    />
);

export default AuthSubmitButton;
