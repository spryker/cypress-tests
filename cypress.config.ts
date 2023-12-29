import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  env: {
    repositoryId: process.env.ENV_REPOSITORY_ID,
    backofficeUrl: process.env.ENV_BACKOFFICE_URL,
    merchantPortalUrl: process.env.ENV_MERCHANT_PORTAL_URL,
    mailCatcherUrl: process.env.ENV_MAIL_CATCHER_URL,
    cli: {
      // TODO: move to .env
      store: 'DE',
      containerPath: '../suite-nonsplit',
      containerName: 'spryker_cli_1',
    },
  },
  e2e: {
    baseUrl: process.env.E2E_BASE_URL,
  },
  viewportWidth: parseInt(process.env.VIEWPORT_WIDGTH ?? '1000', 10),
  viewportHeight: parseInt(process.env.VIEWPORT_HEIGHT ?? '660', 10),
});
