import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ICON_CID = "app-icon";
const __dirname = dirname(fileURLToPath(import.meta.url));

export function getAppIconAttachment() {
  const iconPath = join(__dirname, "../../assets/icon.png");

  return {
    filename: "icon.png",
    content: readFileSync(iconPath),
    cid: ICON_CID,
  };
}

export { ICON_CID };
