import { defineConfig } from 'cypress'
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  env: {
    mailCatcherUrl: process.env.ENV_MAIL_CATCHER_URL,
  },
  e2e: {
    baseUrl: process.env.E2E_BASE_URL,
  },
});
