import React from 'react';
import styles from './AuthHeader.module.css';
/**
 * 認証画面のヘッダーコンポーネント。
 * 認証画面のタイトル、サブタイトル、説明文を表示する。
 *
 * @param {{ title: string, subtitle: string, description: string, compact: boolean }} props
 * @returns {JSX.Element} 認証画面のヘッダーコンポーネント
 */
const AuthHeader = ({ title, subtitle, description, compact = false }) => (
    <>
        <h1 className={`${styles.title} ${compact ? styles.titleCompact : ''}`}>
            {title}
        </h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {description && <p className={styles.description}>{description}</p>}
    </>
);

export default AuthHeader;
