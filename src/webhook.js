import express from "express";
import bodyParser from "body-parser";
import { addToGoogleSheet } from "./googlesheets.js"; // Fixed import
import { config } from "./config.js";

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  console.log("📩 Received Webhook Request:", req.body);

  try {
    const params = req.body.queryResult.parameters;

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
      dateTime: params["date-time"].date_time || "N/A",
    };

    await addToGoogleSheet(bookingData);

    res.json({
      fulfillmentText: `✅ Reservation confirmed for ${bookingData.name}`,
    });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.json({ fulfillmentText: "❌ Booking failed. Try again later." });
  }
});

export default app;
