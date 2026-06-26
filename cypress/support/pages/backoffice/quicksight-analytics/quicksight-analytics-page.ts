import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { QuicksightAnalyticsRepository } from './quicksight-analytics-repository';

@injectable()
@autoWired
export class QuicksightAnalyticsPage extends BackofficePage {
  @inject(REPOSITORIES.QuicksightAnalyticsRepository) private repository: QuicksightAnalyticsRepository;

  protected PAGE_URL = '/analytics-gui/analytics';

  visitAnalytics = (): Cypress.Chainable => {
    cy.intercept('GET', '**/analytics-gui/analytics').as('analyticsDocument');
    cy.visitBackoffice(this.PAGE_URL);

    return cy.wait('@analyticsDocument');
  };

  getSectionTitle = (): Cypress.Chainable => cy.get(this.repository.getSectionTitleSelector());

  getTitleAction = (): Cypress.Chainable => cy.get(this.repository.getTitleActionSelector());

  getSynchronizeUsersButton = (): Cypress.Chainable => cy.get(this.repository.getSynchronizeUsersButtonSelector());

  getNoPermissionMessage = (): Cypress.Chainable => cy.get(this.repository.getNoPermissionMessageSelector());
}
