import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficeSalesReturnGuiCreateRepository } from './backoffice-sales-return-gui-create-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class BackofficeSalesReturnGuiCreatePage extends AbstractPage {
  public PAGE_URL: string = '/sales-return-gui/create';

  constructor(
    @inject(BackofficeSalesReturnGuiCreateRepository) private repository: BackofficeSalesReturnGuiCreateRepository
  ) {
    super();
  }

  public createReturnForAllOrderItems = (): void => {
    this.repository.getAllItemsCheckbox().check();
    this.repository.getCreateReturnButton().click();
  };
}