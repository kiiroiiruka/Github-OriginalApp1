import styles from "./AuthTextLink.module.css";

const AuthTextLink = ({ children, onClick, compact = false }) => (
  <button
    type="button"
    className={`${styles.link} ${compact ? styles.linkCompact : ""}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default AuthTextLink;
