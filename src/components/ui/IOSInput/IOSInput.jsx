// IOSInput.jsx
import React, { useState, useEffect } from "react";
import { toHiragana, toKatakana } from "wanakana";
import axios from "axios";
import styles from "./IOSInput.module.css";

const isIOSStandalone = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isInStandalone = window.navigator.standalone === true
        || window.matchMedia("(display-mode: standalone)").matches;

    // iOS かつ PWA(ホーム画面から起動)の場合だけ true
    return isIOS && isInStandalone;
};
export default function IOSInput({ value, onChange, as = "input", maxLength, placeholder = "ここをタップして入力" }) {
    const [showKeypad, setShowKeypad] = useState(false);
    const [romajiInput, setRomajiInput] = useState("");
    const [hiraganaText, setHiraganaText] = useState("");
    const [katakanaText, setKatakanaText] = useState("");
    const [kanjiCandidates, setKanjiCandidates] = useState([]);
    const [selectedText, setSelectedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [composing, setComposing] = useState(false);

    // リアルタイム変換と候補取得
    useEffect(() => {
        if (romajiInput) {
            const hiragana = toHiragana(romajiInput);
            setHiraganaText(hiragana);
            setKatakanaText(toKatakana(hiragana));
            setComposing(true);

            // 2文字以上で自動的に漢字候補を取得
            if (hiragana.length >= 2 && hiragana !== romajiInput) {
                fetchKanjiCandidates(hiragana);
            }
        } else {
            setHiraganaText("");
            setKatakanaText("");
            setKanjiCandidates([]);
            setComposing(false);
        }
    }, [romajiInput]);

    const handleInput = (char) => {
        const newRomaji = romajiInput + char.toLowerCase();
        setRomajiInput(newRomaji);
        setSelectedText(""); // 新しい入力で選択をリセット
    };

    const handleDelete = () => {
        if (romajiInput.length > 0) {
            // 変換中の文字を削除
            setRomajiInput(romajiInput.slice(0, -1));
            setSelectedText("");
        } else if (value.length > 0) {
            // 確定済みテキストの最後の文字を削除
            const newValue = value.slice(0, -1);
            onChange(newValue);
        }
    };

    const handleSubmit = () => {
        if (composing) {
            // 現在の入力を確定
            const finalText = selectedText || hiraganaText || romajiInput;
            const newValue = value + finalText;

            if (!maxLength || newValue.length <= maxLength) {
                onChange(newValue);
            }

            // 入力状態をリセット
            resetInputState();
        } else {
            // キーパッドを閉じる
            setShowKeypad(false);
        }
    };

    const handleSpace = () => {
        // スペースで現在の入力を確定
        if (composing) {
            handleSubmit();
            // スペースを追加
            setTimeout(() => {
                const newValue = value + " ";
                if (!maxLength || newValue.length <= maxLength) {
                    onChange(newValue);
                }
            }, 0);
        }
    };

    const handleClear = () => {
        resetInputState();
    };

    const resetInputState = () => {
        setRomajiInput("");
        setHiraganaText("");
        setKatakanaText("");
        setKanjiCandidates([]);
        setSelectedText("");
        setComposing(false);
    };

    const selectText = (text, type) => {
        setSelectedText(text);
    };

    const selectKanjiCandidate = (candidate) => {
        // 選択された漢字をテキストに追加
        const newValue = value + candidate.kanji;

        if (!maxLength || newValue.length <= maxLength) {
            onChange(newValue);
        }

        // 入力状態をリセット
        resetInputState();
    };

    // 漢字候補を取得するAPI呼び出し
    const fetchKanjiCandidates = async (hiragana) => {
        setLoading(true);
        try {
            const proxyUrl = "https://api.allorigins.win/get?url=";
            const apiUrl = `https://jisho.org/api/v1/search/words?keyword=${hiragana}`;
            const response = await axios.get(proxyUrl + encodeURIComponent(apiUrl));
            const data = JSON.parse(response.data.contents);
            const words = data.data || [];

            const candidates = words
                .flatMap((word) =>
                    word.japanese?.map((item) => ({
                        kanji: item.word || item.reading,
                        reading: item.reading,
                        meanings: word.senses
                            .map((s) => s.english_definitions.join(", "))
                            .join("; "),
                    })) || []
                )
                .filter((candidate, index, self) =>
                    // 重複を除去
                    index === self.findIndex(c => c.kanji === candidate.kanji)
                )
                .slice(0, 10); // 最大10個まで表示

            setKanjiCandidates(candidates);
        } catch (error) {
            console.error("漢字候補の取得に失敗しました:", error);
            setKanjiCandidates([]);
        } finally {
            setLoading(false);
        }
    };

    // 漢字変換ボタンが押された時の処理
    const handleKanjiConvert = () => {
        if (hiraganaText) {
            fetchKanjiCandidates(hiraganaText);
        }
    };

    // iOS以外では通常のinputを使用
    if (!isIOSStandalone()) {
        const Component = as;
        return (
            <Component
                value={value}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={styles.normalInput}
            />
        );
    }

    // 現在入力中のテキストを取得
    const getCurrentComposingText = () => {
        return selectedText || hiraganaText || romajiInput;
    };

    // 表示用のテキストを構築
    const getDisplayText = () => {
        const confirmedText = value;
        const composingText = getCurrentComposingText();

        return {
            confirmed: confirmedText,
            composing: composingText
        };
    };

    return (
        <div className={styles.wrapper}>
            <div
                className={styles.inputBox}
                onClick={() => setShowKeypad(true)}
            >
                {(() => {
                    const displayText = getDisplayText();
                    if (!displayText.confirmed && !displayText.composing) {
                        return <span className={styles.placeholder}>{placeholder}</span>;
                    }

                    return (
                        <>
                            <span className={styles.confirmedText}>{displayText.confirmed}</span>
                            {displayText.composing && (
                                <span className={styles.composingText}>{displayText.composing}</span>
                            )}
                        </>
                    );
                })()}
            </div>

            {showKeypad && (
                <div className={styles.keypad}>
                    {/* QWERTYキー */}
                    {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, i) => (
                        <div key={i} className={styles.row}>
                            {row.split("").map((char) => (
                                <button
                                    key={char}
                                    className={styles.key}
                                    onClick={() => handleInput(char)}
                                >
                                    {char}
                                </button>
                            ))}
                        </div>
                    ))}

                    {/* 変換候補行（常に表示、横スクロール対応） */}
                    <div className={styles.candidateRow}>
                        <div className={styles.candidateContainer}>
                            {composing ? (
                                <>
                                    {/* ひらがなボタン */}
                                    {hiraganaText && (
                                        <button
                                            className={`${styles.conversionButton} ${selectedText === hiraganaText ? styles.selected : ''}`}
                                            onClick={() => selectText(hiraganaText, 'hiragana')}
                                        >
                                            {hiraganaText}
                                        </button>
                                    )}

                                    {/* カタカナボタン */}
                                    {katakanaText && (
                                        <button
                                            className={`${styles.conversionButton} ${selectedText === katakanaText ? styles.selected : ''}`}
                                            onClick={() => selectText(katakanaText, 'katakana')}
                                        >
                                            {katakanaText}
                                        </button>
                                    )}

                                    {/* 漢字候補ボタン */}
                                    {loading ? (
                                        <div className={styles.loadingText}>読み込み中...</div>
                                    ) : kanjiCandidates.length > 0 ? (
                                        kanjiCandidates.map((candidate, i) => (
                                            <button
                                                key={i}
                                                className={`${styles.conversionButton} ${selectedText === candidate.kanji ? styles.selected : ''}`}
                                                onClick={() => selectKanjiCandidate(candidate)}
                                                title={`${candidate.reading} - ${candidate.meanings}`}
                                            >
                                                {candidate.kanji}
                                            </button>
                                        ))
                                    ) : hiraganaText && (
                                        <div className={styles.noMatch}>一致無し</div>
                                    )}
                                </>
                            ) : (
                                <div className={styles.noMatch}>一致無し</div>
                            )}
                        </div>
                    </div>

                    {/* 機能キー */}
                    <div className={styles.row}>
                        <button className={styles.funcKey} onClick={handleSpace}>スペース</button>
                        <button className={styles.funcKey} onClick={handleDelete}>⌫</button>
                        <button className={styles.funcKey} onClick={handleClear}>クリア</button>
                        <button className={styles.funcKey} onClick={handleKanjiConvert}>漢字変換</button>
                        <button className={styles.funcKey} onClick={handleSubmit}>
                            {composing ? "確定" : "完了"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}