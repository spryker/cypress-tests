import { Repository } from './repository';
import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class Page extends AbstractPage {
  PAGE_URL: string = '/sales-return-gui/create';
  repository: Repository;

  constructor(@inject(Repository) repository: Repository) {
    super();
    this.repository = repository;
  }

  createReturnForAllOrderItems = (): void => {
    this.repository.getAllItemsCheckbox().check();
    this.repository.getCreateReturnButton().click();
  };
}
