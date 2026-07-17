import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MemoHome from '@/pages/MemoHome/MemoHome';
import MemoList from './pages/MemoList/MemoList';
import MemoData from '@/pages/MemoData/MemoData';
import Footer from '@/components/layout/Footer/Footer';
import useFooterSelect from '@/hooks/useFooterSelect';
import TabButtons from '@/components/ui/TabButtons/TabButtons';
import useMemoStore from '@/store/useMemoStore';  // useMemoStore をインポート
import AddMemo from '@/pages/AddMemo/AddMemo';
import Deadline from '@/pages/Deadline/Deadline';
function App() {
  const location = useLocation();
  const { options, selected, handleSelect } = useFooterSelect(['memoHome', 'deadlineHome']);
  //特定のページを開いているときだけフッターを表示させる為の管理パス
  const showFooterPaths = ['/', '/memo', '/deadline'];
  //現在のアクセス先のページパスをlocation.pathnameで取得して、showFooterPathsに含まれているかをincludesメソッドで判定して、shouldShowFooterに代入。
  const shouldShowFooter = showFooterPaths.includes(location.pathname);

  const labelMap = {
    memoHome: 'メモ',
    deadlineHome: '締切',
  };

  // useEffect で loadMemos を実行
  useEffect(() => {
    const loadMemos = useMemoStore.getState().loadMemos;  // useMemoStore から loadMemos を取得
    loadMemos();  // 初期化時にメモをロード(メモされている内容が画面に反映される。)
  }, []);

  return (
    <>
     {/*ページのルーティングを設定*/}
      <Routes>
        <Route path="/" element={<Deadline />} />
        <Route path="/memo" element={<MemoHome />} />
        <Route path="/memoList" element={<MemoList />} />
        <Route path='/memoData' element={<MemoData />} />
        <Route path="/addMemo" element={<AddMemo />} />
        <Route path="/deadline" element={<Deadline />} />
      </Routes>

      {/*特定のページパスじゃない時はfooterは非表示にさせる。*/}
      {shouldShowFooter && (
        <Footer>
          <TabButtons
            options={options}
            selected={selected}
            onSelect={handleSelect}
            labelMap={labelMap}
          />
        </Footer>
      )}
    </>
  );
}

export default App;
