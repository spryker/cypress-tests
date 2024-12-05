import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { StockEditRepository } from './stock-edit-repository';

@injectable()
@autoWired
export class StockEditPage extends BackofficePage {
  @inject(StockEditRepository) private repository: StockEditRepository;

  protected PAGE_URL = '/stock-gui/edit-warehouse';

  assignAllAvailableStore = (): void => {
    this.repository.getStoreRelationTab().click();
    this.repository.getAllAvailableStoresInputs().check();

    this.repository.getSaveButton().click();
  };
}
