import express from "express";
import bodyParser from "body-parser";
import { google } from "googleapis";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Load Google Sheets credentials
const credentials = JSON.parse(fs.readFileSync("google-credentials.json"));
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

// Google Sheets Config
const SPREADSHEET_ID = "1GyUNmUevW2Hi0FIdtd0M-feQZ3H2ddJUVSLdyxLnmL4";
const SHEET_NAME = "Bookings";

// Webhook for Dialogflow
app.post("/webhook", async (req, res) => {
  try {
    const parameters = req.body.queryResult.parameters;

    if (!parameters) {
      return res.json({ fulfillmentText: "Missing booking details!" });
    }

    const { name, phone, guests, "date-time": dateTime } = parameters;
    const bookingDate = dateTime.date_time;

    // Log request for debugging
    console.log("Received booking:", { name, phone, guests, bookingDate });

    // Save to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[name, phone, guests, bookingDate, "Confirmed"]],
      },
    });

    console.log("✅ Booking added to Google Sheets");

    res.json({
      fulfillmentText: `✅ Your table is booked, ${name}!`,
    });
  } catch (error) {
    console.error("❌ Error saving to Google Sheets:", error);
    res.json({
      fulfillmentText: "❌ Sorry, we couldn't book your table right now.",
    });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
