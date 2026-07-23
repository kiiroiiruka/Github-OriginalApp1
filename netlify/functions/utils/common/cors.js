//ブラウザがAPIを呼ぶときのセキュリティルール的なものを本ファイルで設定している。
const DEFAULT_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

export function withCors(headers = {}) {
  return { ...DEFAULT_HEADERS, ...headers };
}

export function handleOptions() {
  return {
    statusCode: 204,
    headers: withCors(),
    body: "",
  };
}
