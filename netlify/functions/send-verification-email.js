import { getAppUrl, getFirebaseAdmin } from "./utils/auth/firebaseAdmin.js";
import { handleOptions } from "./utils/common/cors.js";
import { getBearerToken } from "./utils/common/getBearerToken.js";
import { errorResponse, jsonResponse } from "./utils/common/response.js";
import { getAppIconAttachment } from "./utils/email/iconAttachment.js";
import { sendMail } from "./utils/email/smtp.js";
import { buildVerificationEmail } from "./utils/email/verificationEmailTemplate.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method Not Allowed");
  }

  const idToken = getBearerToken(event.headers);
  if (!idToken) {
    return errorResponse(401, "ログインが必要です");
  }

  try {
    const admin = getFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(idToken);

    if (!decoded.email) {
      return errorResponse(400, "メールアドレスが登録されていません");
    }

    if (decoded.email_verified) {
      return jsonResponse(200, {
        ok: true,
        message: "既にメール認証が完了しています",
      });
    }

    const verificationLink = await admin
      .auth()
      .generateEmailVerificationLink(decoded.email, {
        url: getAppUrl(),
        handleCodeInApp: true,
      }); //handleCodeInAppでメール認証後アプリに直接遷移させることができる

    //メール認証のメールの内容を作成する
    const { subject, text, html } = buildVerificationEmail({
      verificationLink,
    });

    //メール送信に成功した場合は成功を返す
    await sendMail({
      to: decoded.email,
      subject,
      text,
      html,
      attachments: [getAppIconAttachment()],
    });

    //メール送信に失敗した場合はエラーを返す
    return jsonResponse(200, {
      ok: true,
      message: "確認メールを送信しました",
      to: decoded.email,
    });
  } catch (error) {
    console.error("send-verification-email failed:", error);

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
