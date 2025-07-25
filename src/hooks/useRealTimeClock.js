import { useState, useEffect } from "react";

export default function useRealTimeClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date()); // 毎秒更新
        }, 1000);

        return () => clearInterval(timer); // クリーンアップ
    }, []);

    return time; // Dateオブジェクトを返す
}
