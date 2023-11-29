import { defineConfig } from 'cypress'
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  env: {
    backofficeUrl: process.env.ENV_BACKOFFICE_URL,
    mailCatcherUrl: process.env.ENV_MAIL_CATCHER_URL,
  },
  e2e: {
    baseUrl: process.env.E2E_BASE_URL,
  },
});
