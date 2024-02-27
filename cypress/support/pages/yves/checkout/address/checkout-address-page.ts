import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/inversify/types';
import 'reflect-metadata';
import { CheckoutAddressRepository } from './checkout-address-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import {CheckoutAddress} from "../../../../types/yves/checkout";
import { YvesPage } from '../../yves-page';

@injectable()
@autoWired
export class CheckoutAddressPage extends YvesPage {
  protected PAGE_URL: string = '/checkout/address';

  constructor(@inject(TYPES.YvesCheckoutAddressRepository) private repository: CheckoutAddressRepository) {
    super();
  }

  public fillShippingAddress = (checkoutAddress?: CheckoutAddress): void => {
    this.repository.getSelectShippingAddressField().select('0');

    if (!checkoutAddress) {
      checkoutAddress = this.createDummyCheckoutAddress();
    }

    // Setting mandatory fields
    this.repository.getShippingAddressFirstNameField().clear().type(checkoutAddress.firstName);
    this.repository.getShippingAddressLastNameField().clear().type(checkoutAddress.lastName);
    this.repository.getShippingAddressAddress1Field().clear().type(checkoutAddress.address1);
    this.repository.getShippingAddressAddress2Field().clear().type(checkoutAddress.address2);
    this.repository.getShippingAddressZipCodeField().clear().type(checkoutAddress.zipCode);
    this.repository.getShippingAddressCityField().clear().type(checkoutAddress.city);
    this.repository.getShippingAddressBillingSameAsShippingCheckbox().check({ force: true });

    // Setting optional fields
    this.repository.getShippingAddressCompanyField().clear().type(checkoutAddress.company);
    this.repository.getShippingAddressPhoneField().clear().type(checkoutAddress.phone);

    this.repository.getNextButton().click();
  };

  public fillMultiShippingAddress = (checkoutAddresses?: CheckoutAddress[]): void => {
    this.repository.getMultiShipmentTriggerButton().click();

    this.repository
      .getMultiShipmentAddressItemElement()
      .children()
      .each(($addressItem, index) => {
        this.repository.getMultiShipmentAddressItemDeliveryRadio($addressItem).click({ force: true });
        this.repository.getMultiShipmentAddressItemAddressField($addressItem).select('0', { force: true });

        let checkoutAddress: CheckoutAddress | null = checkoutAddresses ? checkoutAddresses[index] : null;
        if (!checkoutAddress) {
          checkoutAddress = this.createDummyCheckoutAddress();
        }

        // Setting mandatory fields
        this.repository
          .getMultiShipmentAddressItemAddressFirstNameField($addressItem, index)
          .clear()
          .type(checkoutAddress.firstName);
        this.repository
          .getMultiShipmentAddressItemAddressLastNameField($addressItem, index)
          .clear()
          .type(checkoutAddress.lastName);
        this.repository
          .getMultiShipmentAddressItemAddressAddress1Field($addressItem, index)
          .clear()
          .type(checkoutAddress.address1);
        this.repository
          .getMultiShipmentAddressItemAddressAddress2Field($addressItem, index)
          .clear()
          .type(checkoutAddress.address2);
        this.repository
          .getMultiShipmentAddressItemAddressZipCodeField($addressItem, index)
          .clear()
          .type(checkoutAddress.zipCode);
        this.repository
          .getMultiShipmentAddressItemAddressCityField($addressItem, index)
          .clear()
          .type(checkoutAddress.city);

        // Setting optional fields
        this.repository
          .getMultiShipmentAddressItemAddressCompanyField($addressItem, index)
          .clear()
          .type(checkoutAddress.company);
        this.repository
          .getMultiShipmentAddressItemAddressPhoneField($addressItem, index)
          .clear()
          .type(checkoutAddress.phone);
      });

    this.fillBillingAddress();
  };

  public fillBillingAddress = (checkoutAddress?: CheckoutAddress): void => {
    this.repository.getSelectBillingAddressField().select('0');

    if (!checkoutAddress) {
      checkoutAddress = this.createDummyCheckoutAddress();
    }

    // Setting mandatory fields
    this.repository.getBillingAddressFirstNameField().clear().type(checkoutAddress.firstName);
    this.repository.getBillingAddressLastNameField().clear().type(checkoutAddress.lastName);
    this.repository.getBillingAddressAddress1Field().clear().type(checkoutAddress.address1);
    this.repository.getBillingAddressAddress2Field().clear().type(checkoutAddress.address2);
    this.repository.getBillingAddressZipCodeField().clear().type(checkoutAddress.zipCode);
    this.repository.getBillingAddressCityField().clear().type(checkoutAddress.city);

    // Setting optional fields
    this.repository.getBillingAddressCompanyField().clear().type(checkoutAddress.company);
    this.repository.getBillingAddressPhoneField().clear().type(checkoutAddress.phone);

    this.repository.getNextButton().click();
  };

  private createDummyCheckoutAddress = (): CheckoutAddress => {
    const prefix = '[e2e] ';

    return {
      firstName: prefix + '' + this.faker.person.firstName(),
      lastName: prefix + '' + this.faker.person.lastName(),
      address1: this.faker.location.secondaryAddress(),
      address2: this.faker.location.buildingNumber(),
      zipCode: this.faker.location.zipCode(),
      city: this.faker.location.city(),
      company: this.faker.company.name(),
      phone: this.faker.phone.number(),
    };
  };
}
