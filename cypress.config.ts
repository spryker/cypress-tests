import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
import { existsSync } from 'fs';

dotenv.config();

const protocolMap: { [key: string]: 'http' | 'https' } = {
  '1': 'https',
  '0': 'http',
  http: 'http',
  https: 'https',
};
const protocol = protocolMap[getEnvVar('ENV_PROTOCOL', 'SPRYKER_SSL_ENABLED')];
const backofficeHost = getEnvVar('ENV_BACKOFFICE_HOST', 'SPRYKER_BE_HOST');
const merchantPortalHost = getEnvVar('ENV_MERCHANT_PORTAL_HOST', 'SPRYKER_MP_HOST');
const glueHost = getEnvVar('ENV_GLUE_HOST', 'SPRYKER_API_HOST');
const glueBackendHost = getEnvVar('ENV_GLUE_BACKEND_HOST', 'SPRYKER_GLUE_BACKEND_HOST');
const glueStorefrontHost = getEnvVar('ENV_GLUE_STOREFRONT_HOST', 'SPRYKER_GLUE_STOREFRONT_HOST');
const mailCatcherHost = getEnvVar('ENV_MAIL_CATCHER_HOST', 'SPRYKER_SMTP_HOST');
const baseHost = getEnvVar('E2E_BASE_HOST', 'SPRYKER_FE_HOST');

export default defineConfig({
  env: {
    repositoryId: process.env.ENV_REPOSITORY_ID,
    isDynamicStoreEnabled: getEnvVar('ENV_IS_DYNAMIC_STORE_ENABLED', 'SPRYKER_DYNAMIC_STORE_MODE') === 'true',
    ENV_IS_SSP_ENABLED: getEnvVar('ENV_IS_SSP_ENABLED', 'ENV_IS_SSP_ENABLED') === 'true',
    backofficeUrl: `${protocol}://${backofficeHost}`,
    merchantPortalUrl: `${protocol}://${merchantPortalHost}`,
    glueUrl: `${protocol}://${glueHost}`,
    glueBackendUrl: `${protocol}://${glueBackendHost}`,
    glueStorefrontUrl: `${protocol}://${glueStorefrontHost}`,
    mailCatcherUrl: `${protocol}://${mailCatcherHost}`,
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    grepUntagged: true,
  },
  e2e: {
    baseUrl: `${protocol}://${baseHost}`,
    setupNodeEvents(on, config) {
      on('task', {
        isFileExists(filename: string): boolean {
          return existsSync(filename);
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
    retries: {
      runMode: 2,
      openMode: 0,
    },
    experimentalMemoryManagement: true,
    injectDocumentDomain: true,
    defaultCommandTimeout: parseInt(process.env.DEFAULT_COMMAND_TIMEOUT ?? '4000', 10),
  },
  viewportWidth: parseInt(process.env.VIEWPORT_WIDGTH ?? '1920', 10),
  viewportHeight: parseInt(process.env.VIEWPORT_HEIGHT ?? '1080', 10),
});

function getEnvVar(primary: string, fallback: string): string {
  const primaryValue = process.env[primary];
  const fallbackValue = process.env[fallback];

  return primaryValue !== undefined ? primaryValue : fallbackValue !== undefined ? fallbackValue : '';
}
