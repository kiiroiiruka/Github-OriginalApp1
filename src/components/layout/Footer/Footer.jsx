import styles from "./Footer.module.css";

const Footer = ({ children }) => {
  //引数から受け取った子要素を表示させる。
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {children} {/* childrenを表示 */}
      </div>
    </footer>
  );
};

export default Footer;
