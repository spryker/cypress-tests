import { injectable } from 'inversify';
import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ImportExportSmokeStaticFixtures } from '@interfaces/smoke';

import { ExportPage, CreateJobPage, JobRunsListPage, CreateRunPage } from '@pages/backoffice';


/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe(
  'product import and export via Backoffice',
  {
    tags: ['@smoke', 'spryker-core', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for b2b-mp or suite', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);

    const createJobPage = container.get(CreateJobPage);
    const jobRunsListPage = container.get(JobRunsListPage);
    const createRunPage = container.get(CreateRunPage);

    const exportPage = container.get(ExportPage);

    let staticFixtures: ImportExportSmokeStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('import template can be downloaded and imported', (): void => {
      const jobName = `smoke-job-${Date.now()}`;
      const templateFile = staticFixtures.templateFile;

      createJobPage.createJob({
        name: jobName,
        description: 'Smoke: import via downloaded template',
      });
      
      createRunPage.createNewRun(jobName);
      createRunPage.downloadCsvTemplate();

      const downloadedPath = `${Cypress.config('downloadsFolder')}/${templateFile}`;
      cy.task<boolean>('isFileExists', downloadedPath).should('eq', true);


      createRunPage.uploadAndQueueImport(downloadedPath);
      jobRunsListPage.verifySuccessMessage()
      
    });

    it('products can be exported and imported', (): void => {

    });
  }
);