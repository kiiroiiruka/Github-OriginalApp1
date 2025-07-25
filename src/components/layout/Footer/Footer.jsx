// components/ui/Footer/Footer.jsx
import React from 'react';
import styles from './Footer.module.css';

const Footer = ({ children }) => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                {children} {/* childrenを表示 */}
            </div>
        </footer>
    );
};

export default Footer;
