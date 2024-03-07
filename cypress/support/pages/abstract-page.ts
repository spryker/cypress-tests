import { faker } from '@faker-js/faker';
import { injectable } from 'inversify';

@injectable()
export class AbstractPage {
  protected PAGE_URL = '';
  protected faker = faker;

  assertPageLocation = (): void => {
    cy.url({ timeout: 4000 }).should('include', this.PAGE_URL);
  };
}
