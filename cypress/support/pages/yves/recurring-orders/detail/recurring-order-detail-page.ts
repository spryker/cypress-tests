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

  getScheduleName = (): Cypress.Chainable => this.repository.getScheduleName();

  getCadence = (): Cypress.Chainable => this.repository.getCadence();

  getStatusBadge = (): Cypress.Chainable => this.repository.getStatusBadge();

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

  fillResumeDate = (date: string): void => {
    this.repository.getResumeDateInput().type(date);
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

  getHistoryViewOrderLink = (): Cypress.Chainable => this.repository.getHistoryViewOrderLink();

  assertHistoryViewRecordStatus = (status: string): void => {
    this.repository.getHistoryViewLatestRecordStatus().contains(status);
  };

  getFlashAlert = (): Cypress.Chainable => this.repository.getFlashAlert();

  getDetailItems = (): Cypress.Chainable => this.repository.getDetailItems();

  getDetailItemQuantity = (): Cypress.Chainable => this.repository.getDetailItemQuantity().first();

  openEditModal = (): void => {
    this.repository.getEditScheduleButton().click();
  };

  setScheduleName = (name: string): void => {
    this.repository.getEditNameInput().filter(':visible').first().clear().type(name);
  };

  selectCadence = (cadenceType: string): void => {
    this.repository.getEditCadenceSelect().select(cadenceType, { force: true });
  };

  setStartDate = (date: string): void => {
    this.repository.getEditStartDateInput().filter(':visible').first().clear().type(date);
  };

  confirmEdit = (): void => {
    this.repository.getEditConfirmButton().filter(':visible').first().click();
  };
}
