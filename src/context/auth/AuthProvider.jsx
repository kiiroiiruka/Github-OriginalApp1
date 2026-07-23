import { useCallback, useEffect, useState } from "react";
import {
  completeEmailVerificationFromUrl,
  reloadUser,
  subscribeAuth,
} from "../../../firebase/client/auth.js";
import { AuthContext } from "./useAuth.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuth((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    completeEmailVerificationFromUrl().then((updated) => {
      if (updated) setUser(updated);
    });

    return unsubscribe;
  }, []);

  const refreshUser = useCallback(async () => {
    const updated = await reloadUser();
    setUser(updated);
    return updated;
  }, []);

  const value = {
    user,
    loading,
    isEmailVerified: user?.emailVerified ?? false,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
