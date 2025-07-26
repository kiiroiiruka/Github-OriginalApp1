// Keypad.jsx
import React, { useState } from "react";
import { toKatakana } from "wanakana";  // ひらがなカタカナ変換ライブラリ
import axios from 'axios';  // HTTPリクエストライブラリ
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
    const [kanjiCandidates, setKanjiCandidates] = useState([]);  // 漢字候補
    const [loading, setLoading] = useState(false);  // API呼び出しのローディング状態

    // 入力処理
    const handleInput = (char) => {
        setInput((prevInput) => prevInput + char);
    };

    // 変換処理: ひらがなをカタカナに変換
    const handleConvert = () => {
        const kana = toKatakana(input);  // 入力されたひらがなをカタカナに変換
        setConvertedText(kana);
        fetchKanjiCandidates(kana);  // 変換したカタカナで漢字候補を取得
    };

    // 漢字候補を取得するAPI呼び出し
    const fetchKanjiCandidates = async (hiragana) => {
        if (!hiragana) return;
        setLoading(true);
        try {
            const response = await axios.get(`https://jisho.org/api/v1/search/words?keyword=${hiragana}`);
            const words = response.data.data;
            // 漢字候補のリストを作成
            const candidates = words.map((word) => word.japanese[0].reading);
            setKanjiCandidates(candidates);
        } catch (error) {
            console.error("API error:", error);
        } finally {
            setLoading(false);
        }
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
        setKanjiCandidates([]);  // 漢字候補をリセット
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

            {/* 漢字候補の表示 */}
            {loading ? (
                <div className={styles.loading}>漢字候補を取得中...</div>
            ) : (
                <div className={styles.kanjiCandidates}>
                    <strong>漢字候補:</strong>
                    {kanjiCandidates.length > 0 ? (
                        <ul>
                            {kanjiCandidates.map((candidate, idx) => (
                                <li key={idx}>{candidate}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>候補はありません。</p>
                    )}
                </div>
            )}
        </div>
    );
}
