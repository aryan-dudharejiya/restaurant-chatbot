import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

console.log("🌍 Environment Variables Loaded:");
console.log("🔢 PORT:", process.env.PORT || 3000);
console.log("📄 SHEET_ID:", process.env.SHEET_ID);
console.log("🔑 Credentials Path:", path.resolve("google-credentials.json"));

const credentialsPath = path.resolve("google-credentials.json");
if (!fs.existsSync(credentialsPath)) {
  console.error("❌ ERROR: google-credentials.json file is missing.");
  process.exit(1);
}

export const config = {
  port: process.env.PORT || 3000,
  sheetId: process.env.SHEET_ID,
  credentialsPath,
};
