import { atom } from "jotai";

// Firestore と useSettingsSync で同期する（デフォルト OFF）
export const autoDeleteAtom = atom(false);
