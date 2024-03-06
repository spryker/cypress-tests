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

import { dirname, parse, relative } from 'path';
import './commands';

// @see error 2306 https://github.com/microsoft/TypeScript/blob/3fcd1b51a1e6b16d007b368229af03455c7d5794/src/compiler/diagnosticMessages.json#L1635
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import registerCypressGrep from '@cypress/grep';
registerCypressGrep();

before(() => {
  loadFixture();
});

const loadFixture = () => {
  const repositoryId = Cypress.env('repositoryId');
  const fixtureFilePath = getFixtureFilePath();
  const dynamicFixturesDefaultFilePath = `${repositoryId}/${fixtureFilePath.directoryPart}/dynamic/${fixtureFilePath.filePart}`;
  const staticFixturesDefaultFilePath = `${repositoryId}/${fixtureFilePath.directoryPart}/static/${fixtureFilePath.filePart}`;

  cy.task('isFileExists', `${Cypress.config('fixturesFolder')}/${staticFixturesDefaultFilePath}.json`).then(
    (isFileExists) => {
      if (isFileExists) {
        cy.fixture(staticFixturesDefaultFilePath).then((staticFixtures) => {
          if (staticFixtures) {
            Cypress.env('staticFixtures', staticFixtures);
          }
        });
      }
    }
  );

  cy.task('isFileExists', `${Cypress.config('fixturesFolder')}/${dynamicFixturesDefaultFilePath}.json`).then(
    (isFileExists) => {
      if (isFileExists) {
        cy.loadDynamicFixturesByPayload(dynamicFixturesDefaultFilePath).then((dynamicFixturesData) => {
          Cypress.env('dynamicFixtures', dynamicFixturesData);
        });
      }
    }
  );
};

const getFixtureFilePath = () => {
  const fullFilePath = Cypress.spec.relative;
  const basePath = 'cypress/e2e/';

  const relativePath = relative(basePath, fullFilePath);

  const directoryPart = dirname(relativePath);
  const filePartWithExtension = parse(relativePath).name;
  const filePartWithoutExtension = filePartWithExtension.replace('.cy', '');

  return {
    directoryPart: directoryPart,
    filePart: filePartWithoutExtension,
  };
};
