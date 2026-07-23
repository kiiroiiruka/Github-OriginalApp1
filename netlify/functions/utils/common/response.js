//front側にJSON形式のデータを返す際の関数
import { withCors } from "./cors.js";

//リクエストを処理して成功した際のレスポンスを返す
export function jsonResponse(statusCode, data) {
  return {
    statusCode,
    headers: withCors({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  };
}

//リクエストを処理して失敗した際のレスポンスを返す
export function errorResponse(statusCode, message) {
  return jsonResponse(statusCode, { error: message });
}
