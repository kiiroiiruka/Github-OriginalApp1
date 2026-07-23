//メールサーバー（SMTP）に接続して、メールを送信できるライブラリ(nodemailer)を使用して、メールを送信する
import nodemailer from "nodemailer";

//SMTPの設定を取得する
export function getSmtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    return null;
  }

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    from: MAIL_FROM,
  };
}

//メールを送信する
export async function sendMail({ to, subject, text, html, attachments = [] }) {
  //SMTPの設定を取得する
  const smtpConfig = getSmtpConfig();
  if (!smtpConfig) {
    throw new Error("SMTP is not configured");
  }

  //メールを送信するためのトランスポーターを作成する
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: smtpConfig.auth,
  });

  //メールを送信する
  await transporter.sendMail({
    from: smtpConfig.from,
    to,
    subject,
    text,
    html,
    attachments,
  });
}
