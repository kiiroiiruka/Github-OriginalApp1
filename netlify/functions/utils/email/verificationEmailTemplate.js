import { ICON_CID } from "./iconAttachment.js";

const APP_NAME = "ミニメモ";

//リンクを受け取りメールの本文を完成させて返す関数。
export function buildVerificationEmail({ verificationLink }) {
  const subject = `【${APP_NAME}】メールアドレスの確認`;

  //メールの本文を作成する
  const text = [
    `${APP_NAME} をご利用いただきありがとうございます。`,
    "",
    "アカウント登録を完了するには、以下のリンクをクリックして",
    "メールアドレスの確認を行ってください。",
    "",
    verificationLink,
    "",
    "※このリンクには有効期限があります。",
    "※心当たりがない場合は、このメールを破棄してください。",
    "",
    "────────────────",
    APP_NAME,
  ].join("\n");

  //メールの本文をHTML形式で作成する
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
            <h2 style="margin: 0; font-size: 20px;">${APP_NAME} メールアドレスの確認</h2>
          </td>
        </tr>
      </table>`;

  const html = `
    <div style="font-family: sans-serif; line-height: 1.7; color: #333;">
      ${headerHtml}
      <p>アカウント登録を完了するには、以下のボタンをクリックしてください。</p>
      <p style="margin: 24px 0;">
        <a href="${verificationLink}"
           style="display: inline-block; padding: 12px 20px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px;">
          メールアドレスを確認する
        </a>
      </p>
      <p style="font-size: 14px; color: #666;">
        ボタンが開けない場合は、以下の URL をブラウザに貼り付けてください。<br />
        <a href="${verificationLink}">${verificationLink}</a>
      </p>
      <p style="font-size: 13px; color: #888;">
        ※このリンクには有効期限があります。<br />
        ※心当たりがない場合は、このメールを破棄してください。
      </p>
    </div>
  `.trim();

  return { subject, text, html };
}
