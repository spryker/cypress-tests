import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SalesShipmentFormRepository } from './sales-shipment-form-repository';

// The choice the address dropdown offers when the shipment should not reuse one of the customer's
// stored addresses; picking it is what reveals the address fields below.
const NEW_ADDRESS_CHOICE = 'New address';

const SHIPMENT_METHOD_OPTION_SEPARATOR = ' - ';

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

  // Every option reads "<carrier> - <method>", and the order detail page prints the two halves on
  // separate lines, so only the method half is yielded for checking the Shipping Method line. The
  // select also carries an empty placeholder option, which is never picked.
  selectShipmentMethod = (position: ShipmentMethodPosition): Cypress.Chainable<string> =>
    this.repository
      .getShipmentMethodSelect()
      .find('option')
      .then(($options: JQuery<HTMLOptionElement>): Cypress.Chainable<string> => {
        const selectableOptions = $options.filter((_index: number, option: HTMLOptionElement) => option.value !== '');
        const option = position === 'first' ? selectableOptions.first() : selectableOptions.last();

        this.repository.getShipmentMethodSelect().select(option.val() as string);

        return cy.wrap(option.text().trim().split(SHIPMENT_METHOD_OPTION_SEPARATOR).pop() as string);
      });

  assignOrderItem = (sku: string): void => {
    this.repository.getOrderItemCheckbox(sku).check();
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}

export type ShipmentMethodPosition = 'first' | 'last';

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
