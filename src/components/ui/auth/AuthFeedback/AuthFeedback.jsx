import React from 'react';
import styles from './AuthFeedback.module.css';
//表示時の文字デザイン(CSS)のタイプと、表示させるメッセージを引数で受け取る。
const AuthFeedback = ({ type = 'error', children }) => {
    //メッセージがない場合は何も表示させない。
    if (!children) return null;
    //typeに応じて文字の色を変える。(error:赤、success:緑、hint:青)
    //AuthFeedback.module.cssのデザインをここで使用
    return (
        <p className={`${styles.feedback} ${styles[type]}`}>
            {children}
        </p>
    );
};

export default AuthFeedback;
