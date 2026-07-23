/**
 * 【新規登録フロー サーバー ② パスワード画面用に期限延長】
 *
 * 呼び出し元: src/api/extendRegistrationSession.js（POST /api/extend-registration-session）
 * 次に呼ぶ: registrationSession.js → extendRegistrationSessionForPasswordEntry()
 *
 * やること: パスワード画面を初めて開いたとき、残り時間を5分にリセット（1回だけ）
 */
import { handleOptions } from "./utils/common/cors.js";
import { parseBody } from "./utils/common/parseBody.js";
import { errorResponse, jsonResponse } from "./utils/common/response.js";
import { extendRegistrationSessionForPasswordEntry } from "./utils/registration/registrationSession.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method Not Allowed");
  }

  const body = parseBody(event.body);
  if (body === null) {
    return errorResponse(400, "リクエスト形式が正しくありません");
  }

  const tokenId = String(body.tokenId ?? "").trim();
  if (!tokenId) {
    return errorResponse(400, "登録トークンが見つかりません");
  }

  try {
    const result = await extendRegistrationSessionForPasswordEntry(tokenId);
    if (!result.ok) {
      const message =
        result.reason === "expired"
          ? "登録の有効期限が切れました。最初からやり直してください"
          : "登録情報が見つかりません。最初からやり直してください";
      return errorResponse(410, message);
    }

    return jsonResponse(200, {
      ok: true,
      expiresAt: result.expiresAt,
      extended: result.extended,
    });
  } catch (error) {
    console.error("extend-registration-session failed:", error);
    return errorResponse(500, "登録セッションの更新に失敗しました");
  }
};
