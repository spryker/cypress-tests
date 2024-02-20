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
  const fixtureFilePath = getFixtureFilePath();
  const dynamicFixturesDefaultFilePath = `${repositoryId}/${fixtureFilePath.directoryPart}/dynamic/${fixtureFilePath.filePart}`;
  const staticFixturesDefaultFilePath = `${repositoryId}/${fixtureFilePath.directoryPart}/static/${fixtureFilePath.filePart}`;

  cy.task('isFileExists', `${Cypress.config('fixturesFolder')}/${staticFixturesDefaultFilePath}.json`).then((isFileExists) => {
    if (isFileExists) {
      cy.fixture(staticFixturesDefaultFilePath).then((staticFixtures) => {
        if (staticFixtures) {
          Cypress.env('staticFixtures', staticFixtures);
        }
      });
    }
  });

  cy.task('isFileExists', `${Cypress.config('fixturesFolder')}/${dynamicFixturesDefaultFilePath}.json`).then((isFileExists) => {
    if (isFileExists) {
      cy.loadDynamicFixturesByPayload(dynamicFixturesDefaultFilePath).then((dynamicFixturesData) => {
        Cypress.env('dynamicFixtures', dynamicFixturesData);
      });
    }
  });
};

const getFixtureFilePath = () => {
  const fullFilePath = Cypress.spec.relative;
  const basePath = 'cypress/e2e/';

  const relativePath = path.relative(basePath, fullFilePath);

  const directoryPart = path.dirname(relativePath);
  const filePartWithExtension = path.parse(relativePath).name;
  const filePartWithoutExtension = filePartWithExtension.replace('.cy', '');

  return {
    directoryPart: directoryPart,
    filePart: filePartWithoutExtension
  };
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
