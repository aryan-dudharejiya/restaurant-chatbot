import dotenv from "dotenv";

dotenv.config();

// Ensure required environment variables exist
if (!process.env.GOOGLE_CREDENTIALS) {
  console.error(
    "❌ ERROR: GOOGLE_CREDENTIALS environment variable is missing."
  );
  process.exit(1);
}

export const config = {
  port: process.env.PORT || 4000,
  sheetId: process.env.SHEET_ID,
  googleCredentials: JSON.parse(process.env.GOOGLE_CREDENTIALS), // Now using ENV instead of a file
};
