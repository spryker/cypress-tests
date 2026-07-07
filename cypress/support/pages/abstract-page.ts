import { faker } from '@faker-js/faker';
import { injectable } from 'inversify';

@injectable()
export class AbstractPage {
  protected PAGE_URL = '';
  protected faker = faker;

  assertPageLocation = (): void => {
    cy.url({ timeout: 20000 }).should('include', this.PAGE_URL);
  };

  assertBodyContainsText = (text: string, options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    cy.get('body').contains(text, options);

  isRepository = (...ids: string[]): boolean => ids.includes(Cypress.env('repositoryId'));
}
