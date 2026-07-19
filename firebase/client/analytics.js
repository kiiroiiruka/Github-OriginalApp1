/**
 * Firebase Analytics へのイベント送信。
 * App.jsx の MainRoutes で trackScreenView を呼び、画面遷移を記録する。
 * Firebase Console のアナリティクスに表示される（反映に時間がかかる場合あり）。
 */

import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { getApp } from "firebase/app";

let analytics = null;

// iOS PWA など非対応環境では初期化をスキップする
const getAnalyticsIfSupported = async () => {
  if (analytics) return analytics;

  try {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(getApp());
    }
  } catch (error) {
    console.warn("Analytics is not available:", error);
  }

  return analytics;
};

// 画面遷移を記録
export const trackScreenView = async (pathname) => {
  const analyticsInstance = await getAnalyticsIfSupported();
  if (!analyticsInstance) return;

  logEvent(analyticsInstance, "screen_view", {
    firebase_screen: pathname,
    firebase_screen_class: pathname,
  });
};

// メモ追加を記録（あとで使う）
export const trackMemoAdded = async (priority) => {
  const analyticsInstance = await getAnalyticsIfSupported();
  if (!analyticsInstance) return;

  logEvent(analyticsInstance, "memo_added", { priority });
};
