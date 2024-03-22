import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SalesReturnCreateRepository } from './sales-return-create-repository';

@injectable()
@autoWired
export class SalesReturnCreatePage extends BackofficePage {
  @inject(SalesReturnCreateRepository) private repository: SalesReturnCreateRepository;

  protected PAGE_URL = '/sales-return-gui/create';

  create = (): void => {
    this.repository.getAllItemsCheckbox().check();
    this.repository.getCreateReturnButton().click();
  };
}
