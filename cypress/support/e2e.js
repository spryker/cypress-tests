// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';
import * as path from 'path';

before(function () {
  loadFixture();
});

beforeEach(function () {
  skipTestIfNotInGroup();
});

const loadFixture = () => {
  const repositoryId = Cypress.env('repositoryId');
  const testFileName = getTestFileName();

  cy.fixture(`${repositoryId}/${testFileName}`).then((fixtureData) => {
    if (fixtureData) {
      Cypress.env('fixtures', fixtureData);
    }
  });
};

const getTestFileName = () => {
  const filePath = Cypress.spec.relative;
  let fileName = path.basename(filePath, path.extname(filePath));

  fileName = fileName.replace('.cy', '');

  return fileName;
};

const skipTestIfNotInGroup = () => {
  const cypressGroups = Cypress.env('groups');
  if (!cypressGroups) {
    return;
  }

  const groups = cypressGroups.split(',');

  if (!groups) return;

  const testName = Cypress.mocha.getRunner().suite.ctx.currentTest.title;
  for (let i = 0; i < groups.length; i++) {
    if (testName.includes(groups[i])) return;
  }

  this.skip();
};
