import express from "express";
import webhookApp from "./src/webhook.js";
import { config } from "./src/config.js";

const app = express();
app.use("/", webhookApp);

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});
