import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import * as process from 'process';

dotenv.config();

const protocolMap: { [key: string]: 'http' | 'https' } = {
  '1': 'https',
  '0': 'http',
  http: 'http',
  https: 'https',
};
const protocol = protocolMap[getEnvVar('ENV_PROTOCOL', 'SPRYKER_SSL_ENABLED')] ?? 'http';
const backofficeHost = getEnvVar('ENV_BACKOFFICE_HOST', 'SPRYKER_BE_HOST') ?? 'backoffice.de.spryker.local';
const merchantPortalHost = getEnvVar('ENV_MERCHANT_PORTAL_HOST', 'SPRYKER_MP_HOST') ?? 'mp.de.spryker.local';
const glueBackendHost =
  getEnvVar('ENV_GLUE_BACKEND_HOST', 'SPRYKER_GLUE_BACKEND_HOST') ?? 'glue-backend.de.spryker.local';
const mailCatcherHost = getEnvVar('ENV_MAIL_CATCHER_HOST', 'SPRYKER_SMTP_HOST') ?? 'mail.spryker.local';
const baseHost = getEnvVar('E2E_BASE_HOST', 'SPRYKER_FE_HOST') ?? 'yves.de.spryker.local';

export default defineConfig({
  env: {
    repositoryId: process.env.ENV_REPOSITORY_ID,
    backofficeUrl: `${protocol}://${backofficeHost}`,
    merchantPortalUrl: `${protocol}://${merchantPortalHost}`,
    glueBackendUrl: `${protocol}://${glueBackendHost}`,
    mailCatcherUrl: `${protocol}://${mailCatcherHost}`,
  },
  e2e: {
    baseUrl: `${protocol}://${baseHost}`,
    setupNodeEvents(on) {
      on('task', {
        isFileExists(filename: string): boolean {
          return existsSync(filename);
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

function getEnvVar(primary: string, fallback: string): string {
  const primaryValue = process.env[primary];
  const fallbackValue = process.env[fallback];

  return primaryValue !== undefined ? primaryValue : fallbackValue !== undefined ? fallbackValue : '';
}
