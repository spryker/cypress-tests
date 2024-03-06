import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficePage } from '../../backoffice-page';
import { SalesReturnGuiCreateRepository } from './sales-return-gui-create-repository';

@injectable()
@autoWired
export class SalesReturnGuiCreatePage extends BackofficePage {
  @inject(SalesReturnGuiCreateRepository) private repository: SalesReturnGuiCreateRepository;

  protected PAGE_URL: string = '/sales-return-gui/create';

  createReturnForAllOrderItems = (): void => {
    this.repository.getAllItemsCheckbox().check();
    this.repository.getCreateReturnButton().click();
  };
}
