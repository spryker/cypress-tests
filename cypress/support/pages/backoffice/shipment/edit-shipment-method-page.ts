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

  addPrices = (): void => {
    this.repository.getPricesTab().click();
    this.repository.getPriceInputs().each(($input) => {
      cy.wrap($input).type('0.00'); // TODO -- use fixtures
    });
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}
