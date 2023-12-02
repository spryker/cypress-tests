import { AbstractPage } from '../../abstract-page';
import { Repository } from './repository';

export class Page extends AbstractPage {
  PAGE_URL = '/sales';
  repository: Repository;

  constructor() {
    super();
    this.repository = new Repository();
  }

  viewLastPlacedOrder = () => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getViewButtons().first().click();
  };
}
