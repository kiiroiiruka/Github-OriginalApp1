import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ICON_CID = "app-icon";

function getIconPath() {
  const candidates = [
    join(process.cwd(), "netlify/functions/assets/icon.png"),
    join(process.cwd(), "assets/icon.png"),
  ];

  for (const path of candidates) {
    if (existsSync(path)) {
      return path;
    }
  }

  throw new Error("Email icon file not found");
}

export function getAppIconAttachment() {
  return {
    filename: "icon.png",
    content: readFileSync(getIconPath()),
    cid: ICON_CID,
  };
}

export { ICON_CID };
