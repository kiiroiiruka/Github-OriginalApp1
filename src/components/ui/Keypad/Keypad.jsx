// Keypad.jsx
import React, { useState } from "react";
import { toKatakana } from "wanakana";  // ひらがなカタカナ変換ライブラリ
import styles from "./Keypad.module.css";

// ひらがなのキー配列
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

export default function Keypad({ onSubmit }) {
    const [input, setInput] = useState("");  // ユーザーの入力
    const [convertedText, setConvertedText] = useState("");  // 変換されたカタカナやひらがな

    // 入力処理
    const handleInput = (char) => {
        setInput((prevInput) => prevInput + char);
    };

    // 変換処理: ひらがなをカタカナに変換
    const handleConvert = () => {
        const kana = toKatakana(input);  // 入力されたひらがなをカタカナに変換
        setConvertedText(kana);
    };

    // 削除処理
    const handleDelete = () => {
        setInput((prevInput) => prevInput.slice(0, -1));  // 最後の1文字を削除
    };

    // 完了処理: 送信
    const handleSubmit = () => {
        onSubmit(convertedText || input);  // 変換したテキストまたはそのままのテキストを送信
        setInput("");  // 入力をリセット
        setConvertedText("");  // 変換テキストをリセット
    };

    return (
        <div className={styles.keypad}>
            {/* ひらがなキーパッド */}
            {HIRAGANA_KEYS.map((row, i) => (
                <div key={i} className={styles.row}>
                    {row.map((char) => (
                        <button
                            key={char}
                            className={styles.key}
                            onClick={() => handleInput(char)}
                            onTouchStart={(e) => e.preventDefault()} // スマホタッチ対応
                        >
                            {char}
                        </button>
                    ))}
                </div>
            ))}

            <div className={styles.row}>
                <button className={styles.funcKey} onClick={handleDelete}>⌫</button>
                <button className={styles.funcKey} onClick={handleConvert}>変換</button>
                <button className={styles.funcKey} onClick={handleSubmit}>完了</button>
            </div>

            {/* 入力と変換結果の表示 */}
            <div className={styles.display}>
                <div>
                    <strong>入力: </strong>
                    <span>{input}</span>
                </div>
                <div>
                    <strong>変換: </strong>
                    <span>{convertedText}</span>
                </div>
            </div>
        </div>
    );
}
