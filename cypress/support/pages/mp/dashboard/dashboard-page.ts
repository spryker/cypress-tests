import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { DashboardRepository } from './dashboard-repository';

@injectable()
@autoWired
export class DashboardPage extends MpPage {
  @inject(DashboardRepository) private repository: DashboardRepository;

  protected PAGE_URL = '/dashboard-merchant-portal-gui/dashboard';

  logout = (): void => {
    this.repository.getUserProfileMenu().click();
    this.repository.getLogoutButton().click();
  };

  interceptRequest = (): string => {
    const alias = 'dashboardPageRequest';
    cy.intercept({ url: this.PAGE_URL }).as(alias);

    return alias;
  };

  getTextContainer = (text: string): Cypress.Chainable =>
    cy.get('body').find(this.repository.getTextContainerSelector(text));
}
