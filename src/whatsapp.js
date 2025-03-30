import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
if (
  !process.env.TWILIO_ACCOUNT_SID ||
  !process.env.TWILIO_AUTH_TOKEN ||
  !process.env.TWILIO_WHATSAPP_NUMBER
) {
  console.error("❌ ERROR: Missing Twilio environment variables.");
  process.exit(1);
}

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendWhatsAppMessage = async (to, message) => {
  try {
    console.log(`📨 Sending WhatsApp message to ${to}...`);
    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
      body: message,
    });
    console.log("✅ WhatsApp message sent successfully:", response.sid);
  } catch (error) {
    console.error(
      "❌ Error sending WhatsApp message:",
      error.code,
      error.message
    );
  }
};
