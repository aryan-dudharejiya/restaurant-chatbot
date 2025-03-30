import express from "express";
import bodyParser from "body-parser";
import { addToGoogleSheet } from "./googlesheets.js";
import { sendWhatsAppMessage } from "./whatsapp.js";

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  console.log(
    "📩 Received Webhook Request:",
    JSON.stringify(req.body, null, 2)
  );

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
      name: params.name.trim(),
      phone: params.phone.replace(/\s+/g, ""), // Remove spaces
      guests: params.guests,
      dateTime: params["date-time"].date_time || "N/A",
    };

    console.log("📊 Booking Data:", bookingData);

    // Save to Google Sheets
    await addToGoogleSheet(bookingData);
    console.log("✅ Booking saved to Google Sheets");

    // Send WhatsApp confirmation
    const message = `✅ Hello ${bookingData.name}, your table is booked for ${bookingData.guests} guests on ${bookingData.dateTime}.`;
    try {
      await sendWhatsAppMessage(bookingData.phone, message);
      console.log("📩 WhatsApp confirmation sent");
    } catch (waError) {
      console.error("⚠️ Failed to send WhatsApp message:", waError.message);
    }

    res.json({
      fulfillmentText: `✅ Reservation confirmed for ${bookingData.name}.`,
    });
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.json({ fulfillmentText: "❌ Booking failed. Try again later." });
  }
});

export default app;
