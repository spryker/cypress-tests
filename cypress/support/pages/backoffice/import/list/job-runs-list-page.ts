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

  verifySuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector())
      .should('be.visible')
      .and('contain', 'Import run created successfully. Processing is queued.');
  }

  waitForSuccessfulJobProcessing = (attempts = 0, maxAttempts = 20): void => {
    // Optional: Guard to prevent infinite loops if the job is stuck
    if (attempts >= maxAttempts) {
      throw new Error(`Job processing timed out after ${maxAttempts} attempts.`);
    }

    this.repository.getFirstTableRow().should('be.visible');

    this.repository
      .getFirstTableRowStatus()
      .invoke('text')
      .then((statusText) => {
        const status = statusText.trim();

        if (status === 'pending' || status === 'processing') {
          // waiting for up to 2 minutes (6s * 20 times) because job starting takes up to a minute and processing may take a bit
          // but should usually be done in less than a minute
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(6000);
          cy.reload();
          this.waitForSuccessfulJobProcessing(attempts + 1, maxAttempts);
        } else {
          this.repository.getFirstTableRowStatus().should('have.text', 'done');
        }
      });
  };

  seeJobRunDetails = (): void => {
    this.repository.getFirstTableRow().should('be.visible', { timeout: 10000 });
    this.repository.getFirstJobRunDetailsButton().click();
  };
}
