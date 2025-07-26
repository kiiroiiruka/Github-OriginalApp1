// Keypad.jsx
import React, { useState } from "react";
import { toHiragana, toKatakana } from "wanakana";  // ひらがなカタカナ変換ライブラリ
import axios from 'axios';  // HTTPリクエストライブラリ
import styles from "./Keypad.module.css";

// QWERTYキー配列
const QWERTY_KEYS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
];

export default function Keypad({ onSubmit, onInput, onDelete }) {
    const [romajiInput, setRomajiInput] = useState("");  // ローマ字入力
    const [hiraganaText, setHiraganaText] = useState("");  // ひらがな変換結果
    const [katakanaText, setKatakanaText] = useState("");  // カタカナ変換結果
    const [kanjiCandidates, setKanjiCandidates] = useState([]);  // 漢字候補
    const [loading, setLoading] = useState(false);  // API呼び出しのローディング状態
    const [selectedText, setSelectedText] = useState("");  // 選択されたテキスト

    // ローマ字入力処理
    const handleInput = (char) => {
        const newRomaji = romajiInput + char.toLowerCase();
        setRomajiInput(newRomaji);

        // リアルタイムでひらがなに変換
        const hiragana = toHiragana(newRomaji);
        setHiraganaText(hiragana);

        // カタカナにも変換
        const katakana = toKatakana(hiragana);
        setKatakanaText(katakana);
    };

    // 漢字変換処理
    const handleKanjiConvert = () => {
        if (hiraganaText) {
            fetchKanjiCandidates(hiraganaText);
        }
    };

    // 漢字候補を取得するAPI呼び出し
    // 漢字候補を取得するAPI呼び出し
    const fetchKanjiCandidates = async (romaji) => {
        if (!romaji) return;
        setLoading(true);
        try {
            // Use AllOrigins proxy to bypass CORS issue
            const proxyUrl = "https://api.allorigins.win/get?url=";
            const apiUrl = `https://jisho.org/api/v1/search/words?keyword=${romaji}`;

            const response = await axios.get(proxyUrl + encodeURIComponent(apiUrl));
            const data = JSON.parse(response.data.contents);  // Parse the response data
            const words = data.data;

            // 漢字候補のリストを作成
            const candidates = words.flatMap((word) => {
                if (word.japanese && word.japanese.length > 0) {
                    return word.japanese.map((item) => ({
                        kanji: item.word || item.reading,
                        reading: item.reading,
                        meanings: word.senses
                            .map((s) => s.english_definitions.join(", "))
                            .join("; "),
                        source: "Jisho.org", // 追加
                    }));
                }
                return [];
            });

            setKanjiCandidates(candidates);
        } catch (error) {
            console.error("API error:", error);
        } finally {
            setLoading(false);
        }
    };

    // 漢字候補選択
    const selectKanjiCandidate = (candidate) => {
        setSelectedText(candidate.kanji);
    };

    // ひらがな選択
    const selectHiragana = () => {
        setSelectedText(hiraganaText);
    };

    // カタカナ選択
    const selectKatakana = () => {
        setSelectedText(katakanaText);
    };

    // 削除処理
    const handleDelete = () => {
        const newRomaji = romajiInput.slice(0, -1);
        setRomajiInput(newRomaji);

        if (newRomaji) {
            const hiragana = toHiragana(newRomaji);
            setHiraganaText(hiragana);
            const katakana = toKatakana(hiragana);
            setKatakanaText(katakana);
        } else {
            setHiraganaText("");
            setKatakanaText("");
            setKanjiCandidates([]);
            setSelectedText("");
        }
    };

    // スペース入力
    const handleSpace = () => {
        setRomajiInput(romajiInput + " ");
        setHiraganaText(hiraganaText + " ");
        setKatakanaText(katakanaText + " ");
    };

    // 完了処理: 送信
    const handleSubmit = () => {
        const finalText = selectedText || hiraganaText || romajiInput;

        if (onInput) {
            onInput(finalText); // ✅ AddMemoに送る
        } else if (onSubmit) {
            onSubmit(finalText);
        }

        // 全てリセット
        setRomajiInput("");
        setHiraganaText("");
        setKatakanaText("");
        setKanjiCandidates([]);
        setSelectedText("");
    };

    // 全クリア
    const handleClear = () => {
        setRomajiInput("");
        setHiraganaText("");
        setKatakanaText("");
        setKanjiCandidates([]);
        setSelectedText("");
    };

    return (
        <div className={styles.keypad}>
            {/* QWERTYキーパッド */}
            {QWERTY_KEYS.map((row, i) => (
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

            {/* 機能キー */}
            <div className={styles.row}>
                <button className={styles.funcKey} onClick={handleSpace}>スペース</button>
                <button className={styles.funcKey} onClick={() => {
                    handleDelete();
                    if (onDelete) onDelete(); // ✅ 親のonDeleteも呼ぶ
                }}>⌫</button>
                <button className={styles.funcKey} onClick={handleClear}>クリア</button>
                <button className={styles.funcKey} onClick={handleKanjiConvert}>漢字変換</button>
                <button className={styles.funcKey} onClick={handleSubmit}>完了</button>
            </div>

            {/* 入力と変換結果の表示 */}
            <div className={styles.display}>
                <div>
                    <strong>ローマ字: </strong>
                    <span>{romajiInput}</span>
                </div>
                <div>
                    <strong>ひらがな: </strong>
                    <span
                        className={selectedText === hiraganaText ? styles.selected : styles.clickable}
                        onClick={selectHiragana}
                    >
                        {hiraganaText}
                    </span>
                </div>
                <div>
                    <strong>カタカナ: </strong>
                    <span
                        className={selectedText === katakanaText ? styles.selected : styles.clickable}
                        onClick={selectKatakana}
                    >
                        {katakanaText}
                    </span>
                </div>
                {selectedText && (
                    <div>
                        <strong>選択中: </strong>
                        <span className={styles.selected}>{selectedText}</span>
                    </div>
                )}
            </div>

            {/* 漢字候補の表示 */}
            {loading ? (
                <div className={styles.loading}>漢字候補を取得中...</div>
            ) : (
                <div className={styles.kanjiCandidates}>
                    {kanjiCandidates.length > 0 && (
                        <>
                            <strong>漢字候補:</strong>
                            <div className={styles.candidateList}>
                                {kanjiCandidates.slice(0, 10).map((candidate, idx) => (
                                    <div
                                        key={idx}
                                        className={`${styles.candidate} ${selectedText === candidate.kanji ? styles.selected : ''}`}
                                        onClick={() => selectKanjiCandidate(candidate)}
                                    >
                                        <div className={styles.kanjiText}>{candidate.kanji}</div>
                                        <div className={styles.readingText}>{candidate.reading}</div>
                                        <div className={styles.meaningText}>{candidate.meanings}</div>
                                        <div className={styles.sourceText}>{candidate.source}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}