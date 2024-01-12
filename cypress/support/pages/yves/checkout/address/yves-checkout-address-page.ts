import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/inversify/types';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import { YvesCheckoutAddressRepository } from './yves-checkout-address-repository';

@injectable()
@autoProvide
export class YvesCheckoutAddressPage extends AbstractPage {
  public PAGE_URL: string = '/checkout/address';

  constructor(
    @inject(TYPES.CheckoutAddressRepository)
    private repository: YvesCheckoutAddressRepository
  ) {
    super();
  }

  fillShippingAddress = (
    firstName?: string,
    lastName?: string,
    address1?: string,
    address2?: string,
    zipCode?: string,
    city?: string,
    company?: string,
    phone?: string
  ): void => {
    this.repository.getSelectShippingAddressField().select('0');

    // Setting mandatory fields
    this.repository
      .getShippingAddressFirstNameField()
      .clear()
      .type(firstName ?? this.faker.person.firstName());
    this.repository
      .getShippingAddressLastNameField()
      .clear()
      .type(lastName ?? this.faker.person.lastName());

    this.repository
      .getShippingAddressAddress1Field()
      .clear()
      .type(address1 ?? this.faker.location.secondaryAddress());
    this.repository
      .getShippingAddressAddress2Field()
      .clear()
      .type(address2 ?? this.faker.location.buildingNumber());
    this.repository
      .getShippingAddressZipCodeField()
      .clear()
      .type(zipCode ?? this.faker.location.zipCode());
    this.repository
      .getShippingAddressCityField()
      .clear()
      .type(city ?? this.faker.location.city());
    this.repository.getShippingAddressBillingSameAsShippingCheckbox().check({ force: true });

    // Setting optional fields
    this.repository
      .getShippingAddressCompanyField()
      .clear()
      .type(company ?? this.faker.company.name());
    this.repository
      .getShippingAddressPhoneField()
      .clear()
      .type(phone ?? this.faker.phone.number());

    this.repository.getNextButton().click();
  };

  fillMultiShippingAddress = (): void => {
    this.repository.getMultiShipmentTriggerButton().click();
    this.repository
      .getMultiShipmentAddressItemElement()
      .children()
      .each(($addressItem, index) => {
        this.repository.getMultiShipmentAddressItemDeliveryRadio($addressItem).click({ force: true });
        this.repository.getMultiShipmentAddressItemAddressField($addressItem).select('0', { force: true });

        // Setting mandatory fields
        this.repository
          .getMultiShipmentAddressItemAddressFirstNameField($addressItem, index)
          .clear()
          .type(this.faker.person.firstName());
        this.repository
          .getMultiShipmentAddressItemAddressLastNameField($addressItem, index)
          .clear()
          .type(this.faker.person.lastName());
        this.repository
          .getMultiShipmentAddressItemAddressAddress1Field($addressItem, index)
          .clear()
          .type(this.faker.location.secondaryAddress());
        this.repository
          .getMultiShipmentAddressItemAddressAddress2Field($addressItem, index)
          .clear()
          .type(this.faker.location.buildingNumber());
        this.repository
          .getMultiShipmentAddressItemAddressZipCodeField($addressItem, index)
          .clear()
          .type(this.faker.location.zipCode());
        this.repository
          .getMultiShipmentAddressItemAddressCityField($addressItem, index)
          .clear()
          .type(this.faker.location.city());

        // Setting optional fields
        this.repository
          .getMultiShipmentAddressItemAddressCompanyField($addressItem, index)
          .clear()
          .type(this.faker.company.name());
        this.repository
          .getMultiShipmentAddressItemAddressPhoneField($addressItem, index)
          .clear()
          .type(this.faker.phone.number());
      });

    this.fillBillingAddress();
  };

  fillBillingAddress = (
    firstName?: string,
    lastName?: string,
    address1?: string,
    address2?: string,
    zipCode?: string,
    city?: string,
    company?: string,
    phone?: string
  ): void => {
    this.repository.getSelectBillingAddressField().select('0');

    // Setting mandatory fields
    this.repository
      .getBillingAddressFirstNameField()
      .clear()
      .type(firstName ?? this.faker.person.firstName());
    this.repository
      .getBillingAddressLastNameField()
      .clear()
      .type(lastName ?? this.faker.person.lastName());

    this.repository
      .getBillingAddressAddress1Field()
      .clear()
      .type(address1 ?? this.faker.location.secondaryAddress());
    this.repository
      .getBillingAddressAddress2Field()
      .clear()
      .type(address2 ?? this.faker.location.buildingNumber());
    this.repository
      .getBillingAddressZipCodeField()
      .clear()
      .type(zipCode ?? this.faker.location.zipCode());
    this.repository
      .getBillingAddressCityField()
      .clear()
      .type(city ?? this.faker.location.city());

    // Setting optional fields
    this.repository
      .getBillingAddressCompanyField()
      .clear()
      .type(company ?? this.faker.company.name());
    this.repository
      .getBillingAddressPhoneField()
      .clear()
      .type(phone ?? this.faker.phone.number());

    this.repository.getNextButton().click();
  };
}
