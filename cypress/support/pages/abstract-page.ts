import 'reflect-metadata';
import { Faker, faker } from '@faker-js/faker';
import { injectable } from 'inversify';

@injectable()
export class AbstractPage {
  // make protected to allow access from child classes only and use visit only
  public PAGE_URL: string = '';
  protected faker: Faker;

  constructor() {
    this.faker = faker;
  }

  assertPageLocation = (): void => {
    cy.url().should('include', this.PAGE_URL);
  };
}
