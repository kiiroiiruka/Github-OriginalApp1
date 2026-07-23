import {
  PASSWORD_ENTRY_TTL_MS,
  REGISTRATION_SESSION_TTL_MS,
} from "../registration/registrationSession.js";
import { ICON_CID } from "./iconAttachment.js";

const APP_NAME = "ミニメモ";
const LINK_TTL_MINUTES = REGISTRATION_SESSION_TTL_MS / (60 * 1000);
const PASSWORD_TTL_MINUTES = PASSWORD_ENTRY_TTL_MS / (60 * 1000);

export function buildRegistrationEmail({ registrationLink }) {
  const subject = `【${APP_NAME}】メールアドレスの確認`;

  const text = [
    `${APP_NAME} をご利用いただきありがとうございます。`,
    "",
    "アカウント登録を完了するには、以下のリンクをクリックして",
    "パスワードを設定してください。",
    "",
    registrationLink,
    "",
    `※リンクの有効期限は${LINK_TTL_MINUTES}分です。`,
    `※リンクを開いたあと、パスワード設定は${PASSWORD_TTL_MINUTES}分以内に完了してください。`,
    "※心当たりがない場合は、このメールを破棄してください。",
    "",
    "────────────────",
    APP_NAME,
  ].join("\n");

  const headerHtml = `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 16px;">
        <tr>
          <td style="padding-right: 12px; vertical-align: middle;">
            <img
              src="cid:${ICON_CID}"
              alt="${APP_NAME}"
              width="48"
              height="48"
              style="display: block; border-radius: 12px;"
            />
          </td>
          <td style="vertical-align: middle;">
            <h2 style="margin: 0; font-size: 20px;">${APP_NAME} アカウント登録</h2>
          </td>
        </tr>
      </table>`;

  const html = `
    <div style="font-family: sans-serif; line-height: 1.7; color: #333;">
      ${headerHtml}
      <p>アカウント登録を完了するには、以下のボタンをクリックしてパスワードを設定してください。</p>
      <p style="margin: 24px 0;">
        <a href="${registrationLink}"
           style="display: inline-block; padding: 12px 20px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px;">
          登録を続ける
        </a>
      </p>
      <p style="font-size: 14px; color: #666;">
        ボタンが開けない場合は、以下の URL をブラウザに貼り付けてください。<br />
        <a href="${registrationLink}">${registrationLink}</a>
      </p>
      <p style="font-size: 13px; color: #888;">
        ※リンクの有効期限は${LINK_TTL_MINUTES}分です。<br />
        ※リンクを開いたあと、パスワード設定は${PASSWORD_TTL_MINUTES}分以内に完了してください。<br />
        ※心当たりがない場合は、このメールを破棄してください。
      </p>
    </div>
  `.trim();

  return { subject, text, html };
}
