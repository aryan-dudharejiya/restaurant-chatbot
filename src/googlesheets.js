import { google } from "googleapis";
import { config } from "./config.js";
import fs from "fs";

const authenticateGoogle = async () => {
  try {
    console.log("🔑 Authenticating Google Sheets API...");
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(fs.readFileSync(config.credentialsPath, "utf-8")),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    console.log("✅ Authentication Successful");
    return auth;
  } catch (error) {
    console.error("❌ Google Auth Error:", error);
    throw new Error("Google authentication failed.");
  }
};

export const addToGoogleSheet = async (data) => {
  try {
    const auth = await authenticateGoogle();
    const sheets = google.sheets({ version: "v4", auth });
    console.log("📊 Adding data to Google Sheets...");

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.sheetId,
      range: "Sheet1!A:D",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[data.name, data.phone, data.guests, data.dateTime]],
      },
    });
    console.log("✅ Data added to Google Sheet");
  } catch (error) {
    console.error("❌ Error adding data:", error);
    throw new Error("Failed to add data to Google Sheets.");
  }
};
