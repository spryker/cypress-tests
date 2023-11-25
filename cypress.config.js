const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // baseUrl: 'http://yves.de.spryker.local',
    baseUrl: 'https://cloud:cloud@www.de.scos.demo-spryker.com',
  }
});
