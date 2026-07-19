import styles from "./TabButtons.module.css";

const TabButtons = ({ tabs, selected, onSelect }) => {
  return (
    <div className={styles.container}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`${styles.button} ${selected === tab.id ? styles.active : ""}`}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabButtons;
