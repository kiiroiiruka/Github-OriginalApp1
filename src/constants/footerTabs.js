// フッターに表示するタブ情報
export const FOOTER_TABS = [
  { id: "memoHome", label: "メモ", path: "/memo" },
  { id: "deadlineHome", label: "締切", path: "/" },
];

// フッターを表示するページのパス一覧
export const FOOTER_VISIBLE_PATHS = FOOTER_TABS.map((tab) => tab.path);
