import { useLocation, useNavigate } from "react-router-dom";

/**
 * @param {Array<{ id: string, label: string, path: string }>} tabs
 */
const getTabIdForPath = (tabs, pathname) => {
  const matched = tabs.find((tab) => tab.path === pathname);
  return matched?.id ?? tabs.find((tab) => tab.path === "/")?.id ?? tabs[0].id;
};

function useFooterSelect(tabs) {
  const location = useLocation(); //現在のパス取得
  const navigate = useNavigate();
  //タブと現在のパスを渡して現時点での選択されているタブのIDを取得。
  const selected = getTabIdForPath(tabs, location.pathname);
  //押されたタブのIDを渡してそのパスにページ遷移させる関数
  const handleSelect = (id) => {
    if (id === selected) return;
    const tab = tabs.find((item) => item.id === id);
    if (!tab) return;
    navigate(tab.path);
  };

  //カスタムフックで利用可能な値と関数を返す。
  //ページ遷移する際はhandleSelect関数を呼び出す。
  //選択されているタブのIDをselectedで取得できる。
  //設定されているページパスとIDもろもろも固まりはtabsで取得できる。
  return {
    tabs,
    selected,
    handleSelect,
  };
}

export default useFooterSelect;
