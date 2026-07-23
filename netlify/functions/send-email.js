import { verifyFirebaseToken } from "./utils/auth/verifyFirebaseToken.js";
import { handleOptions } from "./utils/common/cors.js";
import { getBearerToken } from "./utils/common/getBearerToken.js";
import { parseBody } from "./utils/common/parseBody.js";
import { errorResponse, jsonResponse } from "./utils/common/response.js";
import { sendMail } from "./utils/email/smtp.js";

//メールアドレスの形式のチェック
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//メール送信の処理(Netlify FunctionsのAPIはhandlerという名前で定義する)
//eventはNetlify FunctionsのAPIからのリクエスト情報が入ってくる
//event.httpMethodはリクエストのメソッド(GET, POST, PUT, PATCH, DELETE, OPTIONS)
//event.remotePortはリクエストのリモートポート情報
export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method Not Allowed");
  }

  const idToken = getBearerToken(event.headers); //firebaseのログインした人を識別するトークンを取得する
  if (!idToken) {
    return errorResponse(401, "ログインが必要です");
  }

  let firebaseUser;
  try {
    //firebaseのログインした人を識別するトークンを検証する
    firebaseUser = await verifyFirebaseToken(idToken);
  } catch {
    return errorResponse(500, "認証の設定が完了していません");
  }

  if (!firebaseUser) {
    return errorResponse(401, "ログインの有効期限が切れています");
  }

  const body = parseBody(event.body); //frontからきたデータをオブジェクトにする
  if (!body) {
    //オブジェクトにならなかった場合はエラーを返す
    return errorResponse(400, "リクエスト形式が正しくありません");
  }

  const { to, subject, message } = body; //オブジェクトからto, subject, messageを取り出す
  if (!to || !subject || !message) {
    return errorResponse(400, "to, subject, message は必須です");
  }

  if (!EMAIL_REGEX.test(to)) {
    //toがメールアドレスの形式でない場合はエラーを返す
    return errorResponse(400, "送信先メールアドレスの形式が正しくありません");
  }

  try {
    //メール送信に成功した場合は成功を返す
    await sendMail({
      to,
      subject,
      text: message,
    });
    return jsonResponse(200, {
      ok: true,
      message: "メールを送信しました",
      to,
    });
  } catch (error) {
    //メール送信に失敗した場合はエラーを返す
    console.error("send-email failed:", error);
    if (error.message === "SMTP is not configured") {
      return errorResponse(
        500,
        "メール送信の設定（SMTP_HOST など）が完了していません",
      );
    }
    return errorResponse(500, "メールの送信に失敗しました");
  }
};
