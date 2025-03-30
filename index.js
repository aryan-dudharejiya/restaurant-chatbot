import express from "express";
import webhookApp from "./src/webhook.js";
import { config } from "./src/config.js";

const app = express();
app.use("/", webhookApp);

const server = app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});

// Handle server errors
server.on("error", (error) => {
  console.error("❌ Server Error:", error.message);
  process.exit(1);
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("🛑 Shutting down server gracefully...");
  server.close(() => {
    console.log("✅ Server closed. Exiting process...");
    process.exit(0);
  });
});
