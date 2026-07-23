//firebaseのログインした人を識別するトークン、request元の
//ユーザーがどのトークンのユーザーなのかを返す。
//nllならログインしていないと判断する。
export function getBearerToken(headers = {}) {
  const authorization = headers.authorization ?? headers.Authorization ?? "";
  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }
  return token;
}
