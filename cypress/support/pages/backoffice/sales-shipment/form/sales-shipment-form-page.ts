import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SalesShipmentFormRepository } from './sales-shipment-form-repository';

// The choice the address dropdown offers when the shipment should not reuse one of the customer's
// stored addresses; picking it is what reveals the address fields below.
const NEW_ADDRESS_CHOICE = 'New address';

@injectable()
@autoWired
export class SalesShipmentFormPage extends BackofficePage {
  @inject(SalesShipmentFormRepository) private repository: SalesShipmentFormRepository;

  // Create and edit render the same form block, so one page object drives both.
  protected PAGE_URL = '/shipment-gui';

  fillNewDeliveryAddress = (address: ShipmentAddress): void => {
    this.repository.getDeliveryAddressSelect().select(NEW_ADDRESS_CHOICE);
    this.repository.getSalutationSelect().select(address.salutation);
    this.repository.getFirstNameField().clear().type(address.firstName);
    this.repository.getLastNameField().clear().type(address.lastName);
    this.repository.getEmailField().clear().type(address.email);
    this.repository.getCountrySelect().select(address.country);
    this.repository.getAddress1Field().clear().type(address.address1);
    this.repository.getAddress2Field().clear().type(address.address2);
    this.repository.getCityField().clear().type(address.city);
    this.repository.getZipCodeField().clear().type(address.zipCode);
  };

  // Every option reads "<carrier> - <method>", which is how the order detail page's two separate
  // Delivery Method and Shipping Method lines can be checked against the one that was picked.
  getShipmentMethodOptions = (): Cypress.Chainable<JQuery<HTMLOptionElement>> =>
    this.repository.getShipmentMethodSelect().find('option');

  selectShipmentMethod = (idShipmentMethod: string): void => {
    this.repository.getShipmentMethodSelect().select(idShipmentMethod);
  };

  assignOrderItem = (sku: string): void => {
    this.repository.getOrderItemCheckbox(sku).check();
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}

export interface ShipmentAddress {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
}
