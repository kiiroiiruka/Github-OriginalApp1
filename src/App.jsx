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
import CompleteRegistration from "@/pages/Auth/CompleteRegistration";
import PendingRegistration from "@/pages/Auth/PendingRegistration";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import Deadline from "@/pages/Deadline/Deadline";
import MemoData from "@/pages/MemoData/MemoData";
import MemoHome from "@/pages/MemoHome/MemoHome";
import useMemoStore from "@/store/useMemoStore";
import { trackScreenView } from "../firebase/client/analytics.js";
import { getPendingRegistration } from "../firebase/client/registration.js";
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

/**
 * 【新規登録フロー 振り分け】
 *
 * /complete-registration → CompleteRegistration.jsx（メールリンク用）
 * それ以外 → AuthenticatedApp
 *   未ログイン + localStorage に token あり → PendingRegistration.jsx
 *   未ログイン + token なし → Auth.jsx
 *   ログイン済み → MainRoutes（メモ画面など）
 */
function App() {
  const shouldRedirectHome = useRef(false);
  const { user, loading, isEmailVerified } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user || !isEmailVerified) {
      shouldRedirectHome.current = true;
    }
  }, [user, loading, isEmailVerified]);

  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  return (
    <Routes>
      <Route path="/complete-registration" element={<CompleteRegistration />} />
      <Route
        path="*"
        element={
          <AuthenticatedApp
            user={user}
            isEmailVerified={isEmailVerified}
            shouldRedirectHome={shouldRedirectHome}
          />
        }
      />
    </Routes>
  );
}

function AuthenticatedApp({ user, isEmailVerified, shouldRedirectHome }) {
  //!userでFirebase にログインしていない状態
  if (!user) {
    // localStorage に仮トークンがあればメール確認待ち画面へ
    if (getPendingRegistration()) {
      return <PendingRegistration />;
    }
    //もしない場合は初期のログイン画面へ遷移
    return <Auth />;
  }

  if (!isEmailVerified) {
    return <VerifyEmail />;
  }

  if (shouldRedirectHome.current) {
    shouldRedirectHome.current = false;
    return <Navigate to="/" replace />;
  }

  return <MainRoutes />;
}

export default App;
