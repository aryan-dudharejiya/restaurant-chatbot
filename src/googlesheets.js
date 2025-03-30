import { google } from "googleapis";
import { config } from "./config.js";

const authenticateGoogle = async () => {
  try {
    console.log("🔑 Authenticating Google Sheets API...");

    if (!config.googleCredentials) {
      throw new Error(
        "❌ Google credentials are missing in environment variables."
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: config.googleCredentials, // Now using ENV instead of file
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    console.log("✅ Authentication Successful");
    return auth;
  } catch (error) {
    console.error("❌ Google Auth Error:", error.message);
    throw new Error("Google authentication failed.");
  }
};

export const addToGoogleSheet = async (data) => {
  try {
    if (!data.name || !data.phone || !data.guests || !data.dateTime) {
      throw new Error(
        "❌ Missing data fields. Cannot add empty values to Google Sheets."
      );
    }

    const auth = await authenticateGoogle();
    const sheets = google.sheets({ version: "v4", auth });

    console.log("📊 Adding data to Google Sheets:", data);

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.sheetId,
      range: "Sheet1!A:D",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            data.name.trim(),
            data.phone.trim(),
            data.guests,
            data.dateTime.trim(),
          ],
        ],
      },
    });

    console.log("✅ Data successfully added to Google Sheet");
  } catch (error) {
    console.error("❌ Error adding data:", error.message);
    throw new Error("Failed to add data to Google Sheets.");
  }
};
