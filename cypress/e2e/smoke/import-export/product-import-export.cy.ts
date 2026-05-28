import { injectable } from 'inversify';
import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ShopThemeSmokeStaticFixtures } from '@interfaces/smoke';

import { ExportRepository } from '@pages/backoffice/export/export-repository';
import { ExportPage } from '@pages/backoffice/export/export-page';

import { CreateJobRepository } from '@pages/backoffice/import/create/create-job-repository';
import { CreateJobPage } from '@pages/backoffice/import/create/create-job-page';
import { JobsListRepository } from '@pages/backoffice/import/list/jobs-list-repository';
import { JobsListPage } from '@pages/backoffice/import/list/jobs-list-page';
import { CreateRunRepository } from '@pages/backoffice/import/create/create-run-repository';
import { CreateRunPage } from '@pages/backoffice/import/create/create-run-page';

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

    // page objects (constructed with repos to stay consistent with inversify style)
    const createJobPage = new CreateJobPage(container.get(CreateJobRepository));
    const jobsListPage = new JobsListPage(container.get(JobsListRepository));
    const createRunPage = new CreateRunPage(container.get(CreateRunRepository));

    const exportPage = new ExportPage(container.get(ExportRepository));

    let staticFixtures: ShopThemeSmokeStaticFixtures;

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
      const jobName = `smoke-template-${Date.now()}`;

      // 1) create import job
      createJobPage.createJob({
        name: jobName,
        description: 'Smoke: import via downloaded template',
      });

      // 2) create run for that job
      jobsListPage.clickCreateRunForJob(jobName);

      // 3) export template
      exportPage.exportTemplate('Product');

      // 4) import downloaded file (draft: uses static fixture as stand-in)
      // NOTE: In CI we usually move the downloaded file into fixtures or use cypress/downloads.
      createRunPage.uploadAndQueueImport(staticFixtures.templateFile);
    });

    it('products can be exported and imported', (): void => {
      const jobName = `smoke-products-${Date.now()}`;

      // 1) create import job
      createJobPage.createJob({
        name: jobName,
        description: 'Smoke: export all products and import back',
      });

      // 2) create run for that job
      jobsListPage.clickCreateRunForJob(jobName);

      // 3) export products
      exportPage.exportData('Product');

      // 4) import downloaded file (draft: uses static fixture as stand-in)
      createRunPage.uploadAndQueueImport(staticFixtures.productFile);
    });
  }
);
