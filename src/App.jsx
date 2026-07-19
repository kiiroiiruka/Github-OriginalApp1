import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "@/components/layout/Footer/Footer";
import TabButtons from "@/components/ui/TabButtons/TabButtons";
import { useAuth } from "@/context/auth/useAuth";
import useFooterSelect from "@/hooks/useFooterSelect";
import useMemoSync from "@/hooks/useMemoSync";
import AddMemo from "@/pages/AddMemo/AddMemo";
import Auth from "@/pages/Auth/Auth";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import Deadline from "@/pages/Deadline/Deadline";
import MemoData from "@/pages/MemoData/MemoData";
import MemoHome from "@/pages/MemoHome/MemoHome";
import useMemoStore from "@/store/useMemoStore";
import { trackScreenView } from "../firebase/client/analytics.js";
import styles from "./App.module.css";
import MemoList from "./pages/MemoList/MemoList";

function MainRoutes() {
  const location = useLocation();
  const { options, selected, handleSelect } = useFooterSelect([
    "memoHome",
    "deadlineHome",
  ]);
  const showFooterPaths = ["/", "/memo", "/deadline"];
  const shouldShowFooter = showFooterPaths.includes(location.pathname);

  const labelMap = {
    memoHome: "メモ",
    deadlineHome: "締切",
  };

  const memosLoading = useMemoStore((state) => state.loading);

  useMemoSync();

  useEffect(() => {
    trackScreenView(location.pathname);
  }, [location.pathname]);

  if (memosLoading) {
    return <div className={styles.loading}>メモを読み込み中...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Deadline />} />
        <Route path="/memo" element={<MemoHome />} />
        <Route path="/memoList" element={<MemoList />} />
        <Route path="/memoData" element={<MemoData />} />
        <Route path="/addMemo" element={<AddMemo />} />
        <Route path="/deadline" element={<Deadline />} />
      </Routes>

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
//ログイン状態に応じて表示させるページを切り替える
function App() {
  //ログイン状態を取得
  const { user, loading, isEmailVerified } = useAuth();
  //loading中は読み込み中を表示
  if (loading) {
    //App.module.cssのデザインをここでのみ使用
    return <div className={styles.loading}>読み込み中...</div>;
  }

  //ログインしていない場合はログイン画面を表示
  if (!user) {
    //ログイン画面を表示
    return <Auth />;
  }

  //メール認証していない場合はメール認証画面を表示
  if (!isEmailVerified) {
    //メール認証画面を表示
    return <VerifyEmail />;
  }
  //ログインしていてメール認証している場合はメインルーティング(アプリ起動時の初期画面)を表示
  return <MainRoutes />;
}

export default App;
