import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

export default defineConfig({
  env: {
    repositoryId: process.env.ENV_REPOSITORY_ID,
    backofficeUrl: process.env.ENV_BACKOFFICE_URL,
    merchantPortalUrl: process.env.ENV_MERCHANT_PORTAL_URL,
    glueBackendUrl: process.env.ENV_GLUE_BACKEND_URL,
    mailCatcherUrl: process.env.ENV_MAIL_CATCHER_URL,
  },
  e2e: {
    baseUrl: process.env.E2E_BASE_URL,
    setupNodeEvents(on) {
      on('task', {
        isFileExists(filename): boolean {
          return fs.existsSync(filename);
        },
      });
    },
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
  viewportWidth: parseInt(process.env.VIEWPORT_WIDGTH ?? '1000', 10),
  viewportHeight: parseInt(process.env.VIEWPORT_HEIGHT ?? '660', 10),
});
