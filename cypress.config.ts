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
const protocol = "https";
const backofficeHost = "backoffice.b2b-marketplace-eu.demo-spryker.com";
const merchantPortalHost = "mp.b2b-marketplace-eu.demo-spryker.com";
const glueHost = "glue.b2b-marketplace-eu.demo-spryker.com";
const glueBackendHost = "glue.b2b-marketplace-eu.demo-spryker.com";
const glueStorefrontHost = "glue.b2b-marketplace-eu.demo-spryker.com";
const mailCatcherHost = "www.b2b-marketplace-eu.demo-spryker.com";
const baseHost = "www.b2b-marketplace-eu.demo-spryker.com";

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
    grepUntagged: true
  },
  e2e: {
    baseUrl: `${protocol}://${baseHost}`,
    setupNodeEvents(on,config) {
      on('task', {
        isFileExists(filename: string): boolean {
          return existsSync(filename);
        },
      });
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
