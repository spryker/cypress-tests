import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { QuicksightAnalyticsRepository } from './quicksight-analytics-repository';

@injectable()
@autoWired
export class QuicksightAnalyticsPage extends BackofficePage {
  @inject(QuicksightAnalyticsRepository) private repository: QuicksightAnalyticsRepository;

  protected PAGE_URL = '/analytics-gui/analytics';

  visitAnalytics = (): Cypress.Chainable => {
    cy.intercept('GET', '**/analytics-gui/analytics').as('analyticsDocument');
    cy.visitBackoffice(this.PAGE_URL);

    return cy.wait('@analyticsDocument');
  };

  getSectionTitle = (): Cypress.Chainable => cy.get(this.repository.getSectionTitleSelector());

  getSectionTitleText = (): string => this.repository.getSectionTitleText();

  getSynchronizeUsersButton = (): Cypress.Chainable => cy.get(this.repository.getSynchronizeUsersButtonSelector());

  getSynchronizeUsersLabel = (): string => this.repository.getSynchronizeUsersLabel();

  getInfoAlert = (): Cypress.Chainable => cy.get(this.repository.getInfoAlertSelector());

  getNoPermissionText = (): string => this.repository.getNoPermissionText();

  getSynchronizeUsersForm = (): Cypress.Chainable => cy.get(this.repository.getSynchronizeUsersFormSelector());

  getSynchronizeUsersFormAction = (): string => this.repository.getSynchronizeUsersFormAction();

  getSynchronizeUsersCsrfToken = (): Cypress.Chainable =>
    cy.get(this.repository.getSynchronizeUsersCsrfTokenSelector());
}
