import { Repository } from './repository';
import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/auto-provide';

@injectable()
@autoProvide
export class Page extends AbstractPage {
  PAGE_URL = '/sales-return-gui/create';
  repository: Repository;

  constructor(@inject(Repository) repository: Repository) {
    super();
    this.repository = repository;
  }

  createReturnForAllOrderItems = () => {
    this.repository.getAllItemsCheckbox().check();
    this.repository.getCreateReturnButton().click();
  };
}
