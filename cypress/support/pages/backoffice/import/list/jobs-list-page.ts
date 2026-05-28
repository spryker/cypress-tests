import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '../../backoffice-page';
import { JobsListRepository } from './jobs-list-repository';

@injectable()
@autoWired
export class JobsListPage extends BackofficePage {
  @inject(JobsListRepository) private repository: JobsListRepository;

  protected PAGE_URL = '/product-experience-management/job/index';

 checkJobExistsInList = (importJobReference: string): void => {
    //this.repository.getFirstTableRow().should('contain', importJobReference);
    this.repository.getAllTableRows().should('contain', importJobReference);
  };
}
