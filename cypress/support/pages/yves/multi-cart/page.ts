import { AbstractPage } from '../../abstract-page';
import { Repository } from './repository';

export class Page extends AbstractPage {
  PAGE_URL = '/multi-cart';
  repository: Repository;

  constructor() {
    super();
    this.repository = new Repository();
  }

  createCart = (name?: string): void => {
    cy.visit(`${this.PAGE_URL}/create`);
    this.repository
      .getCreateCartNameInput()
      .clear()
      .type(name ?? `Cart #${this.faker.string.uuid()}`);
    this.repository.getCreateCartForm().submit();
  };
}
