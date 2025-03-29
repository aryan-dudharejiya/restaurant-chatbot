import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

// Debugging: Log environment variables to check if they're loaded
console.log("🌍 Environment Variables Loaded:");
console.log("🔢 PORT:", process.env.PORT || 3000);
console.log("📄 SHEET_ID:", process.env.SHEET_ID);
console.log("🔑 Credentials Path:", path.resolve("google-credentials.json"));

// Ensure credentials file exists
const credentialsPath = path.resolve("google-credentials.json");
if (!fs.existsSync(credentialsPath)) {
  console.error(
    "❌ ERROR: google-credentials.json file is missing in the root directory."
  );
  process.exit(1); // Exit if credentials file is missing
}

export const config = {
  port: process.env.PORT || 3000,
  sheetId: process.env.SHEET_ID,
  credentialsPath,
};
