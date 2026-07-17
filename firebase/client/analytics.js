import { logEvent } from 'firebase/analytics';
import { analytics } from '../config.js';

// 画面遷移を記録
export const trackScreenView = (pathname) => {
  logEvent(analytics, 'screen_view', {
    firebase_screen: pathname,
    firebase_screen_class: pathname,
  });
};

// メモ追加を記録（あとで使う）
export const trackMemoAdded = (priority) => {
  logEvent(analytics, 'memo_added', { priority });
};