import { injectable } from 'inversify';
import { BackofficePage } from '../../backoffice-page';
import { JobsListRepository } from './jobs-list-repository';

@injectable()
export class JobsListPage extends BackofficePage {
  protected PAGE_URL = '/import-gui/list-job';

  constructor(private readonly repository: JobsListRepository) {
    super();
  }

  clickCreateRunForJob = (jobName: string): void => {
    this.visit();

    this.find({
      searchQuery: jobName,
      interceptTableUrl: '/import-gui/list-job/table',
      expectedToSeeInTable: jobName,
    }).then(($row) => {
      if (!$row) {
        throw new Error(`Job row not found for: ${jobName}`);
      }

      cy.wrap($row).find(this.repository.getRunsButtonSelector()).click();
      cy.get(this.repository.getCreateRunButtonSelector()).click();
    });
  };
}
