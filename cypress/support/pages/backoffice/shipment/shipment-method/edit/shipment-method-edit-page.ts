import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ShipmentMethodEditRepository } from './shipment-method-edit-repository';
import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class ShipmentMethodEditPage extends BackofficePage {
  @inject(ShipmentMethodEditRepository) private repository: ShipmentMethodEditRepository;

  assignAllAvailableStore = (): void => {
    this.repository.getStoreRelationTab().click();
    this.repository.getAllAvailableStoresInputs().check();
  };

  addPrices = (price = '1.00'): void => {
    this.repository.getPricesTab().click();
    this.repository.getPriceInputs().each(($input) => {
      cy.wrap($input).type(price, { delay: 0 });
    });
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}
