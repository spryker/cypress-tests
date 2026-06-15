import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { RecurringOrderDetailRepository } from './recurring-order-detail-repository';

@injectable()
@autoWired
export class RecurringOrderDetailPage extends YvesPage {
  @inject(REPOSITORIES.YvesRecurringOrderDetailRepository)
  private repository: RecurringOrderDetailRepository;

  protected PAGE_URL = '/recurring-orders';

  visitDetail = (uuid: string): void => {
    cy.visit(`/recurring-orders/${uuid}`);
  };

  assertScheduleName = (name: string): void => {
    this.repository.getScheduleName().should('contain', name);
  };

  assertCadenceVisible = (): void => {
    this.repository.getCadence().should('be.visible');
  };

  assertStatusBadge = (status: string): void => {
    this.repository.getStatusBadge().should('contain', status);
  };

  clickPause = (): void => {
    this.repository.getPauseButton().click();
  };

  clickResume = (): void => {
    this.repository.getResumeButton().click();
  };

  clickCancel = (): void => {
    this.repository.getCancelButton().click();
  };

  clickSkipFromNextExecution = (): void => {
    this.repository.getSkipButton().click();
  };

  clickReviewRequired = (): void => {
    this.repository.getReviewButton().click();
  };

  confirmPause = (): void => {
    this.repository.getPauseConfirmButton().click();
  };

  confirmResume = (): void => {
    this.repository.getResumeConfirmButton().click();
  };

  confirmSkip = (): void => {
    this.repository.getSkipConfirmButton().click();
  };

  confirmCancel = (): void => {
    this.repository.getCancelConfirmButton().click();
  };
}
