// Keypad.jsx
import React from "react";
import styles from "./Keypad.module.css";

const HIRAGANA_KEYS = [
    ["あ", "い", "う", "え", "お"],
    ["か", "き", "く", "け", "こ"],
    ["さ", "し", "す", "せ", "そ"],
    ["た", "ち", "つ", "て", "と"],
    ["な", "に", "ぬ", "ね", "の"],
    ["は", "ひ", "ふ", "へ", "ほ"],
    ["ま", "み", "む", "め", "も"],
    ["や", "ゆ", "よ"],
    ["ら", "り", "る", "れ", "ろ"],
    ["わ", "を", "ん"],
];

export default function Keypad({ onInput, onDelete, onConvert, onSubmit }) {
    return (
        <div className={styles.keypad}>
            {HIRAGANA_KEYS.map((row, i) => (
                <div key={i} className={styles.row}>
                    {row.map((char) => (
                        <button
                            key={char}
                            className={styles.key}
                            onClick={() => onInput(char)}
                        >
                            {char}
                        </button>
                    ))}
                </div>
            ))}

            <div className={styles.row}>
                <button className={styles.funcKey} onClick={onDelete}>⌫</button>
                <button className={styles.funcKey} onClick={onConvert}>変換</button>
                <button className={styles.funcKey} onClick={onSubmit}>完了</button>
            </div>
        </div>
    );
}
