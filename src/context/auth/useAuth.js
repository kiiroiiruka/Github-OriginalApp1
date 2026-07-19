//contextAPIを使用するためのimport
import { createContext, useContext } from 'react';

/*
ここでcreateContextを宣言することで、AuthContextをグローバルで操作できるようになる。
例：AuthProvider.jsx内の「<AuthContext.Provider value={value}>」とやった場合は、
valueの値をグローバルで操作できるようになる。（グローバル変数として扱える）
*/
export const AuthContext = createContext(null);



/*
「<AuthContext.Provider value={value}>」でセットした
valueの値の操作が以下の関数を呼び出すことで可能になる。
*/
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
