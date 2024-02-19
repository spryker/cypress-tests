import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

export default defineConfig({
  env: {
    repositoryId: process.env.ENV_REPOSITORY_ID,
    backofficeUrl: process.env.ENV_BACKOFFICE_URL,
    merchantPortalUrl: process.env.ENV_MERCHANT_PORTAL_URL,
    mailCatcherUrl: process.env.ENV_MAIL_CATCHER_URL,
    operationRunnerUrl: process.env.OPERATION_RUNNER_URL,
    cli: {
      // TODO: move to .env
      store: 'DE',
      containerPath: '../suite-nonsplit',
      containerName: 'spryker_cli_1',
    },
  },
  e2e: {
    baseUrl: process.env.E2E_BASE_URL,
    defaultCommandTimeout: 8000,
    setupNodeEvents(on, config) {
      on('task', {
        isFileExists(filename): boolean {
          if (fs.existsSync(filename)) {
            return true;
          }
          return false;
        },
      });
    },
  },
  viewportWidth: parseInt(process.env.VIEWPORT_WIDGTH ?? '1000', 10),
  viewportHeight: parseInt(process.env.VIEWPORT_HEIGHT ?? '660', 10),
});
