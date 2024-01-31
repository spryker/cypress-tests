import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class MpDashboardRepository {
  getUserProfileMenu = (): Cypress.Chainable => cy.get('.spy-user-menu');
  getLogoutButton = (): Cypress.Chainable =>
    cy.get('.spy-user-menu__content.ng-star-inserted').find('a:contains("Logout")');
}
