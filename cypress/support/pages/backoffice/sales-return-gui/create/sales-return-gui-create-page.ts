import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { SalesReturnGuiCreateRepository } from './sales-return-gui-create-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { BackofficePage } from '../../backoffice-page';

@injectable()
@autoWired
export class SalesReturnGuiCreatePage extends BackofficePage {
  protected PAGE_URL: string = '/sales-return-gui/create';

  constructor(
    @inject(SalesReturnGuiCreateRepository) private repository: SalesReturnGuiCreateRepository
  ) {
    super();
  }

  public createReturnForAllOrderItems = (): void => {
    this.repository.getAllItemsCheckbox().check();
    this.repository.getCreateReturnButton().click();
  };
}
