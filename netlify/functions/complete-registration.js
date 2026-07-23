/**
 * 【新規登録フロー サーバー ③ 本登録完了】
 *
 * 呼び出し元: src/api/completeRegistration.js（POST /api/complete-registration）
 * 次に呼ぶ:
 *   - registrationSession.js → consumeRegistrationSession()（トークン有効性チェック）
 *   - Firebase Admin → createUser()（本登録）
 *
 * やること: トークン確認 → Firebase Auth にユーザー作成 → 仮トークン削除
 */
import { getFirebaseAdmin } from "./utils/auth/firebaseAdmin.js";
import { handleOptions } from "./utils/common/cors.js";
import { parseBody } from "./utils/common/parseBody.js";
import { errorResponse, jsonResponse } from "./utils/common/response.js";
import {
  consumeRegistrationSession,
  deleteRegistrationSession,
} from "./utils/registration/registrationSession.js";

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
  //ーー↓PostでAPIをたたけば以降が実行対象になる。↓ーー
  const tokenId = String(body.tokenId ?? "").trim();
  const password = String(body.password ?? "");

  if (!tokenId) {
    return errorResponse(400, "登録トークンが見つかりません");
  }

  if (password.length < 6) {
    return errorResponse(400, "パスワードは6文字以上にしてください");
  }

  try {
    //仮登録データが有効かをチェックする。
    const result = await consumeRegistrationSession(tokenId);
    if (!result.ok) {
      const message =
        result.reason === "expired"
          ? "登録の有効期限が切れました。最初からやり直してください"
          : "登録情報が見つかりません。最初からやり直してください";
      return errorResponse(410, message);
    }

    const { email } = result.session;
    const admin = getFirebaseAdmin();

    try {
      //メールアドレスが既に登録されているかをチェックする。
      await admin.auth().getUserByEmail(email);
      //仮登録データを削除する。
      await deleteRegistrationSession(tokenId);
      //エラーメッセージを返す。
      return errorResponse(400, "このメールアドレスは既に登録されています");
    } catch (error) {
      if (error.code !== "auth/user-not-found") {
        throw error;
      }
    }
    //アカウントを作成する。
    await admin.auth().createUser({
      email,
      password,
      emailVerified: true,
    });

    //仮登録データを削除する。
    await deleteRegistrationSession(tokenId);

    //成功メッセージを返す。
    return jsonResponse(200, {
      ok: true,
      email,
      message: "アカウント登録が完了しました",
    });
  } catch (error) {
    console.error("complete-registration failed:", error);

    if (error.message === "Firebase Admin credentials are not configured") {
      return errorResponse(500, "Firebase Admin の設定が完了していません");
    }

    if (error.code === "auth/email-already-exists") {
      return errorResponse(400, "このメールアドレスは既に登録されています");
    }

    if (error.code === "auth/invalid-password") {
      return errorResponse(400, "パスワードは6文字以上にしてください");
    }

    return errorResponse(500, "アカウント登録に失敗しました");
  }
};
