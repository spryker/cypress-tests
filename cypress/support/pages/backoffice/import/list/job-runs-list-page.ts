import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '../../backoffice-page';
import { JobRunsListRepository } from './job-runs-list-repository';

@injectable()
@autoWired
export class JobRunsListPage extends BackofficePage {
  @inject(JobRunsListRepository) private repository: JobRunsListRepository;

  protected PAGE_URL = 'product-experience-management/run/index';

  private buildUrl = (importJobId: string): string => `${this.PAGE_URL}?idImportJob=${encodeURIComponent(importJobId)}`;

  seeJobRuns = (importJobId: string): void => {
    cy.visitBackoffice(this.buildUrl(importJobId));
  };

  getSuccessMessage = (): Cypress.Chainable => cy.get(this.repository.getSuccessMessageSelector());
}
