import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "@/components/layout/Footer/Footer";
import TabButtons from "@/components/ui/TabButtons/TabButtons";
import { FOOTER_TABS, FOOTER_VISIBLE_PATHS } from "@/constants/footerTabs";
import { useAuth } from "@/context/auth/useAuth";
import useFooterSelect from "@/hooks/useFooterSelect";
import useMemoSync from "@/hooks/useMemoSync";
import useSettingsSync from "@/hooks/useSettingsSync";
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
import SendEmailTest from "./pages/SendEmailTest/SendEmailTest";

function MainRoutes() {
  const location = useLocation();
  const { tabs, selected, handleSelect } = useFooterSelect(FOOTER_TABS);
  const shouldShowFooter = FOOTER_VISIBLE_PATHS.includes(location.pathname);
  const memosLoading = useMemoStore((state) => state.loading);

  useMemoSync();
  useSettingsSync();

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
        <Route path="/sendEmailTest" element={<SendEmailTest />} />
        <Route path="/deadline" element={<Navigate to="/" replace />} />
      </Routes>

      {shouldShowFooter && (
        <Footer>
          <TabButtons tabs={tabs} selected={selected} onSelect={handleSelect} />
        </Footer>
      )}
    </>
  );
}
//ログイン状態に応じて表示させるページを切り替える
function App() {
  const shouldRedirectHome = useRef(false);
  //ログイン状態を取得
  const { user, loading, isEmailVerified } = useAuth();

  //ログイン状態の確認
  useEffect(() => {
    if (loading) return;

    if (!user || !isEmailVerified) {
      shouldRedirectHome.current = true;
    }
  }, [user, loading, isEmailVerified]);

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
  // 認証フローを通った直後だけ、締切画面（/）へリダイレクトする
  if (shouldRedirectHome.current) {
    shouldRedirectHome.current = false;
    return <Navigate to="/" replace />;
  }

  //アプリの各ページ内容を表示させる
  return <MainRoutes />;
}

export default App;
