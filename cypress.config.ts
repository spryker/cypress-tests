import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://yves.de.spryker.local',
    // baseUrl: 'https://cloud:cloud@www.de.scos.demo-spryker.com',
  },
  service: {
    mailCatcherUrl: 'http://mail.spryker.local',
  },
});
