import { auth } from '../config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

// ログイン
export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

//標準関数でオリジナル関数作成
export const register = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// ログアウト(firebaseのサインアウト関数を活用してログアウト関数作成)
export const logout = () => signOut(auth);

// ログイン状態の監視
export const subscribeAuth = (callback) =>
  onAuthStateChanged(auth, callback);