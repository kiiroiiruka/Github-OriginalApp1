/**
 * 【新規登録フロー サーバー ① 仮登録開始】
 *
 * 呼び出し元: src/api/startRegistration.js（POST /api/start-registration）
 * 次に呼ぶ:
 *   - registrationSession.js → createRegistrationSession()（Firestore に仮トークン作成）
 *   - registrationEmailTemplate.js + smtp.js（確認メール送信）
 *
 * やること: メール重複チェック → 仮トークン作成 → 確認メール送信
 */
import { getAppUrl, getFirebaseAdmin } from "./utils/auth/firebaseAdmin.js";
import { handleOptions } from "./utils/common/cors.js";
import { parseBody } from "./utils/common/parseBody.js";
import { errorResponse, jsonResponse } from "./utils/common/response.js";
import { getAppIconAttachment } from "./utils/email/iconAttachment.js";
import { buildRegistrationEmail } from "./utils/email/registrationEmailTemplate.js";
import { sendMail } from "./utils/email/smtp.js";
import {
  createRegistrationSession,
  deleteSessionsByEmail,
} from "./utils/registration/registrationSession.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//メールアドレスが既に登録されているかどうかを確認する関数
async function isEmailRegistered(email) {
  try {
    await getFirebaseAdmin().auth().getUserByEmail(email);
    return true;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return false;
    }
    throw error;
  }
}

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

  const email = String(body.email ?? "")
    .trim() //.trim()前後の空白を削除
    .toLowerCase(); //英字をすべて小文字へ変換

  if (!email || !EMAIL_PATTERN.test(email)) {
    return errorResponse(400, "メールアドレスの形式が正しくありません");
  }

  try {
    if (await isEmailRegistered(email)) {
      return errorResponse(400, "このメールアドレスは既に登録されています");
    }
    //既存の仮トークン管理するセクションがもしあれば削除する。
    await deleteSessionsByEmail(email);

    //仮登録トークンを作成して、有効期限を設定する。
    const { tokenId, expiresAt } = await createRegistrationSession(email);
    //トークンが切れるまでにアクセスできるURLを作成する。
    const registrationLink = `${getAppUrl()}/complete-registration?token=${tokenId}`;

    //登録メールの本文を作成する。
    const { subject, text, html } = buildRegistrationEmail({
      registrationLink,
    });

    //登録メールを送信する。
    await sendMail({
      to: email,
      subject,
      text,
      html,
      attachments: [getAppIconAttachment()],
    });

    //成功メッセージを返す。
    return jsonResponse(200, {
      ok: true,
      tokenId,
      email,
      expiresAt,
      message: "確認メールを送信しました",
    });
  } catch (error) {
    console.error("start-registration failed:", error);

    if (error.message === "Firebase Admin credentials are not configured") {
      return errorResponse(500, "Firebase Admin の設定が完了していません");
    }

    if (error.message === "SMTP is not configured") {
      return errorResponse(
        500,
        "メール送信の設定（SMTP_HOST など）が完了していません",
      );
    }

    if (error.code === "EAUTH") {
      return errorResponse(
        500,
        "Gmail のアプリパスワードが正しくありません。SMTP_PASS を確認してください",
      );
    }

    return errorResponse(500, "確認メールの送信に失敗しました");
  }
};
