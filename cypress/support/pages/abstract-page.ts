import { faker } from '@faker-js/faker';
import { injectable } from 'inversify';

@injectable()
export class AbstractPage {
  protected PAGE_URL = '';
  protected faker = faker;

  assertPageLocation = (): void => {
    // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Page-navigation guard: confirming arrival on PAGE_URL is a page-object responsibility.
    cy.url({ timeout: 20000 }).should('include', this.PAGE_URL);
  };

  assertBodyContainsText = (text: string, options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    cy.get('body').contains(text, options);

  getBody = (): Cypress.Chainable => cy.get('body');

  isRepository = (...ids: string[]): boolean => ids.includes(Cypress.env('repositoryId'));
}
