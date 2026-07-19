import React from "react";
import styles from "./AuthLayout.module.css";

/**
 * 認証画面のレイアウトコンポーネント。
 * 認証画面の背景とカードのスタイルを適用する。
 *
 * @param {{ children: React.ReactNode }} props 認証画面の子コンポーネント
 * @returns {JSX.Element} 認証画面のレイアウトコンポーネント
 */
const AuthLayout = ({ children }) => (
  <div className={styles.page}>
    <div className={styles.card}>{children}</div>
  </div>
);

export default AuthLayout;
