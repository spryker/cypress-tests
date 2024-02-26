import 'reflect-metadata';
import { Faker, faker } from '@faker-js/faker';
import { injectable } from 'inversify';

@injectable()
export class AbstractPage {
  protected PAGE_URL: string = '';
  protected faker: Faker;

  constructor() {
    this.faker = faker;
  }

  public assertPageLocation = (): void => {
    cy.url({ timeout: 4000 }).should('include', this.PAGE_URL);
  };
}
