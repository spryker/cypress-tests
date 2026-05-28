import { injectable } from 'inversify';
import { BackofficePage } from '../../backoffice-page';
import { JobRunsListRepository } from './job-runs-list-repository';

@injectable()
export class JobRunsListPage extends BackofficePage {
  protected PAGE_URL = '/import-gui/list-run';

  constructor(private readonly repository: JobRunsListRepository) {
    super();
  }

  openFirstRunDetails = (): void => {
    // assumes we are navigated here from job runs list
    this.find({
      searchQuery: '',
      interceptTableUrl: '/import-gui/list-run/table',
      expectedCount: null,
    }).then(($row) => {
      if (!$row) {
        throw new Error('No job runs found');
      }

      cy.wrap($row).find(this.repository.getDetailsButtonSelector()).click();
    });
  };
}
