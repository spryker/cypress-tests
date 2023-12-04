import { Faker, faker } from '@faker-js/faker';

export class AbstractPage {
  PAGE_URL = '';
  protected faker: Faker;

  constructor() {
    this.faker = faker;
  }

  assertPageLocation = (): void => {
    cy.url().should('include', this.PAGE_URL);
  };
}
