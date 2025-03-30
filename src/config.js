import dotenv from "dotenv";

dotenv.config();

// Ensure required environment variables exist
if (!process.env.GOOGLE_CREDENTIALS) {
  console.error(
    "❌ ERROR: GOOGLE_CREDENTIALS environment variable is missing."
  );
  process.exit(1);
}

if (!process.env.SHEET_ID) {
  console.error("❌ ERROR: SHEET_ID environment variable is missing.");
  process.exit(1);
}

// Parse Google Credentials safely
let googleCredentials;
try {
  googleCredentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
} catch (error) {
  console.error(
    "❌ ERROR: Failed to parse GOOGLE_CREDENTIALS. Ensure it is valid JSON."
  );
  process.exit(1);
}

export const config = {
  port: process.env.PORT || 3000, // Using 3000 for consistency
  sheetId: process.env.SHEET_ID,
  googleCredentials,
};
