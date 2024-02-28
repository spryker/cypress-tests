import {defineConfig} from 'cypress';
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

function getEnvVar(primary: string, fallback: string): string {
    return process.env[primary] || process.env[fallback];
}

const protocol = getEnvVar('ENV_PROTOCOL', 'SPRYKER_SSL_ENABLE') ? 'https' : 'http';
const backofficeHost = getEnvVar('ENV_BACKOFFICE_HOST', 'SPRYKER_BE_HOST');
const merchantPortalHost = getEnvVar('ENV_MERCHANT_PORTAL_HOST', 'SPRYKER_MP_HOST');
const glueBackendHost = getEnvVar('ENV_GLUE_BACKEND_HOST', 'SPRYKER_GLUE_BACKEND_HOST');
const mailCatcherHost = getEnvVar('ENV_MAIL_CATCHER_HOST', 'SPRYKER_SMTP_HOST');
const baseHost = getEnvVar('E2E_BASE_HOST', 'SPRYKER_FE_HOST');

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
