import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { EditShipmentMethodRepository } from './edit-shipment-method-repository';
import { BackofficePage } from '@pages/backoffice';
@injectable()
@autoWired
export class EditShipmentMethodPage extends BackofficePage {
  @inject(EditShipmentMethodRepository) private repository: EditShipmentMethodRepository;

  assignAllAvailableStore = (): void => {
    this.repository.getStoreRelationTab().click();
    this.repository.getAllAvailableStoresInputs().check();
  };

  addPrices = (price: string = '0.00'): void => {
    this.repository.getPricesTab().click();
    this.repository.getPriceInputs().each(($input) => {
      cy.wrap($input).type(price);
    });
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}
