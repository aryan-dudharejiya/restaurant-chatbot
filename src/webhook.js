import express from "express";
import bodyParser from "body-parser";
import { addToGoogleSheet } from "./googleSheetsService.js";
import { config } from "./config.js";

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  console.log(
    "📩 Received Webhook Request:",
    JSON.stringify(req.body, null, 2)
  );

  try {
    const params = req.body.queryResult.parameters;

    // Ensure all required fields are present
    if (
      !params.name ||
      !params.phone ||
      !params.guests ||
      !params["date-time"]
    ) {
      throw new Error("❌ Missing required parameters");
    }

    const bookingData = {
      name: params.name,
      phone: params.phone,
      guests: params.guests,
      dateTime: params["date-time"]?.date_time || "N/A",
    };

    console.log("📝 Extracted Booking Data:", bookingData);

    // Send data to Google Sheets
    await addToGoogleSheet(bookingData);
    console.log("✅ Booking successfully added to Google Sheets!");

    res.json({
      fulfillmentText: `✅ Reservation confirmed for ${bookingData.name} on ${bookingData.dateTime}.`,
    });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.json({
      fulfillmentText:
        "⚠️ Sorry, there was an issue saving your reservation. Please try again.",
    });
  }
});

export default app;
