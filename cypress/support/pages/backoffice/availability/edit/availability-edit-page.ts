import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { AvailabilityEditRepository } from './availability-edit-repository';

@injectable()
@autoWired
export class AvailabilityEditPage extends BackofficePage {
  @inject(AvailabilityEditRepository) private repository: AvailabilityEditRepository;

  protected PAGE_URL = '/availability-gui/edit/view';

  uncheckFirstStock = (): void => {
    this.repository.getFirstStockQuantityInput().type('0');
    this.repository.getFirstIsNeverOutOfStockCheckbox().uncheck();

    this.repository.getSaveButton().click();
  };
}
