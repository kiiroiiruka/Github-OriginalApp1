import { atomWithStorage } from 'jotai/utils';

// トグルボタンの状態を管理するためのatom
// ローカルストレージに永続化して、ページ再読み込みやタブ間で状態を保持する
export const autoDeleteAtom = atomWithStorage('autoDelete', false);

