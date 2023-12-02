import { Repository } from './repository';
import { AbstractPage } from '../../../abstract-page';

export class Page extends AbstractPage {
  PAGE_URL = '/sales-return-gui/create';
  repository: Repository;

  constructor() {
    super();
    this.repository = new Repository();
  }

  createReturnForAllOrderItems = () => {
    this.repository.getAllItemsCheckbox().check();
    this.repository.getCreateReturnButton().click();
  };
}
