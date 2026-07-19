import { useEffect, useState } from "react";

export default function useRealTimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 1秒ごとに現時刻を取得して時間更新するタイマーセット。
    const timer = setInterval(() => {
      setTime(new Date()); // 毎秒更新
    }, 1000);

    return () => clearInterval(timer); //ページ離れるたびに毎回タイマー削除
  }, []);

  return time; // Dateオブジェクトを返す
}
