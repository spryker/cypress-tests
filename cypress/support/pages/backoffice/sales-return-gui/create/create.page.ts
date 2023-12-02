import { CreateRepository } from './create.repository';
import { Page } from '../../../page';

export class CreatePage extends Page {
  PAGE_URL = '/sales-return-gui/create';
  repository: CreateRepository;

  constructor() {
    super();
    this.repository = new CreateRepository();
  }

  createReturnForAllOrderItems = () => {
    this.repository.getAllItemsCheckbox().check();
    this.repository.getCreateReturnButton().click();
  };
}
