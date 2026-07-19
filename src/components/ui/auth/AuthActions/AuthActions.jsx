import React from 'react';
import styles from './AuthActions.module.css';

const AuthActions = ({ children, as = 'div', ...props }) => {
    //入力(form要素)の時とただ表示させる時でスタイルを切り替える。
    const className = as === 'form' ? styles.form : styles.actions;
    //入力か？そのまま表示させるかを変数にセットさせる。
    const Tag = as;
    //入力する時もただ表示させる時でも両方で活用できるようにする。
    return <Tag className={className} {...props}>{children}</Tag>;
};

export default AuthActions;
