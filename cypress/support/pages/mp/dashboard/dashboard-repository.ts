import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class DashboardRepository {
  getUserProfileMenu = (): Cypress.Chainable => cy.get('.spy-user-menu');
  getLogoutButton = (): Cypress.Chainable =>
    cy.get('.spy-user-menu__content.ng-star-inserted').find('a:contains("Logout")');
}
