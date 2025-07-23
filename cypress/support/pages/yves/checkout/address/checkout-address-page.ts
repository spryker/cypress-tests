import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CheckoutAddressRepository } from './checkout-address-repository';

@injectable()
@autoWired
export class CheckoutAddressPage extends YvesPage {
  @inject(REPOSITORIES.CheckoutAddressRepository) private repository: CheckoutAddressRepository;

  protected PAGE_URL = '/checkout/address';

  fillShippingAddress = (params?: FillShippingAddressParams): void => {
    if (params?.idCustomerAddress) {
      this.repository.getSelectShippingAddressField().select(params.idCustomerAddress.toString(), { force: true });
      this.repository.getShippingAddressBillingSameAsShippingCheckbox().check({ force: true });

      this.repository.getNextButton().click();

      return;
    }

    const checkoutAddress = this.createDummyCheckoutAddress();
    this.repository.getSelectShippingAddressField().select('0', { force: true });

    // Setting mandatory fields
    this.repository.getShippingAddressFirstNameField().clear().type(checkoutAddress.firstName, { delay: 0 });
    this.repository.getShippingAddressLastNameField().clear().type(checkoutAddress.lastName, { delay: 0 });
    this.repository.getShippingAddressAddress1Field().clear().type(checkoutAddress.address1, { delay: 0 });
    this.repository.getShippingAddressAddress2Field().clear().type(checkoutAddress.address2, { delay: 0 });
    this.repository.getShippingAddressZipCodeField().clear().type(checkoutAddress.zipCode, { delay: 0 });
    this.repository.getShippingAddressCityField().clear().type(checkoutAddress.city, { delay: 0 });
    this.repository.getShippingAddressBillingSameAsShippingCheckbox().check({ force: true });

    // Setting optional fields
    this.repository.getShippingAddressCompanyField().clear().type(checkoutAddress.company, { delay: 0 });
    this.repository.getShippingAddressPhoneField().clear().type(checkoutAddress.phone, { delay: 0 });

    this.repository.getNextButton().click();
  };

  fillMultiShippingAddress = (params?: FillShippingAddressParams): void => {
    if (this.isRepository('b2c', 'b2b', 'b2b-mp')) {
      this.repository.getSelectShippingAddressField().select('-1', { force: true });
    } else {
      this.repository.getMultiShipmentTriggerButton().click();
    }

    this.repository
      .getMultiShipmentAddressItemElement()
      .children()
      .each(($addressItem, index) => {
        const checkoutAddress = this.createDummyCheckoutAddress();

        if (!this.isRepository('b2c', 'b2b', 'b2b-mp')) {
          this.repository.getMultiShipmentAddressItemDeliveryRadio($addressItem, index).click({ force: true });
        }

        if (params?.idCustomerAddress) {
          this.repository
            .getMultiShipmentAddressItemAddressField($addressItem, index)
            .select(params.idCustomerAddress.toString(), { force: true });

          return;
        }

        this.repository.getMultiShipmentAddressItemAddressField($addressItem, index).select('0', { force: true });

        // Setting mandatory fields
        this.repository
          .getMultiShipmentAddressItemAddressFirstNameField($addressItem, index)
          .clear()
          .type(checkoutAddress.firstName, { delay: 0 });
        this.repository
          .getMultiShipmentAddressItemAddressLastNameField($addressItem, index)
          .clear()
          .type(checkoutAddress.lastName, { delay: 0 });
        this.repository
          .getMultiShipmentAddressItemAddressAddress1Field($addressItem, index)
          .clear()
          .type(checkoutAddress.address1, { delay: 0 });
        this.repository
          .getMultiShipmentAddressItemAddressAddress2Field($addressItem, index)
          .clear()
          .type(checkoutAddress.address2, { delay: 0 });
        this.repository
          .getMultiShipmentAddressItemAddressZipCodeField($addressItem, index)
          .clear()
          .type(checkoutAddress.zipCode, { delay: 0 });
        this.repository
          .getMultiShipmentAddressItemAddressCityField($addressItem, index)
          .clear()
          .type(checkoutAddress.city, { delay: 0 });

        // Setting optional fields
        this.repository
          .getMultiShipmentAddressItemAddressCompanyField($addressItem, index)
          .clear()
          .type(checkoutAddress.company, { delay: 0 });
        this.repository
          .getMultiShipmentAddressItemAddressPhoneField($addressItem, index)
          .clear()
          .type(checkoutAddress.phone, { delay: 0 });
      });

    this.fillBillingAddress();
  };

  fillSingleCheckoutAddress = (): void => {
    const checkoutAddress = this.createDummyCheckoutAddress();

    cy.document().then((doc) => {
      const addressItemFormFieldList = doc.querySelector('[data-qa="component address-item-form-field-list"]');

      if (addressItemFormFieldList) {
        this.repository
          .getMultiShipmentAddressItemElement()
          .children()
          .first()
          .then(($addressItem) => {
            this.repository.getMultiShipmentAddressItemAddressField($addressItem, 0).select('0', { force: true });
            this.repository
              .getMultiShipmentAddressItemAddressFirstNameField($addressItem, 0)
              .clear()
              .type(checkoutAddress.firstName, { delay: 0 });
            this.repository
              .getMultiShipmentAddressItemAddressLastNameField($addressItem, 0)
              .clear()
              .type(checkoutAddress.lastName, { delay: 0 });
            this.repository
              .getMultiShipmentAddressItemAddressAddress1Field($addressItem, 0)
              .clear()
              .type(checkoutAddress.address1, { delay: 0 });
            this.repository
              .getMultiShipmentAddressItemAddressAddress2Field($addressItem, 0)
              .clear()
              .type(checkoutAddress.address2, { delay: 0 });
            this.repository
              .getMultiShipmentAddressItemAddressZipCodeField($addressItem, 0)
              .clear()
              .type(checkoutAddress.zipCode, { delay: 0 });
            this.repository
              .getMultiShipmentAddressItemAddressCityField($addressItem, 0)
              .clear()
              .type(checkoutAddress.city, { delay: 0 });

            // Setting optional fields
            this.repository
              .getMultiShipmentAddressItemAddressCompanyField($addressItem, 0)
              .clear()
              .type(checkoutAddress.company, { delay: 0 });
            this.repository
              .getMultiShipmentAddressItemAddressPhoneField($addressItem, 0)
              .clear()
              .type(checkoutAddress.phone, { delay: 0 });
          });
      }

      this.fillBillingAddress();
      this.repository.getNextButton().click();
    });
  };

  fillBillingAddress = (): void => {
    const checkoutAddress = this.createDummyCheckoutAddress();
    this.repository.getSelectBillingAddressField().select('0', { force: true });

    // Setting mandatory fields
    this.repository.getBillingAddressFirstNameField().clear().type(checkoutAddress.firstName, { delay: 0 });
    this.repository.getBillingAddressLastNameField().clear().type(checkoutAddress.lastName, { delay: 0 });
    this.repository.getBillingAddressAddress1Field().clear().type(checkoutAddress.address1, { delay: 0 });
    this.repository.getBillingAddressAddress2Field().clear().type(checkoutAddress.address2, { delay: 0 });
    this.repository.getBillingAddressZipCodeField().clear().type(checkoutAddress.zipCode, { delay: 0 });
    this.repository.getBillingAddressCityField().clear().type(checkoutAddress.city, { delay: 0 });

    // Setting optional fields
    this.repository.getBillingAddressCompanyField().clear().type(checkoutAddress.company, { delay: 0 });
    this.repository.getBillingAddressPhoneField().clear().type(checkoutAddress.phone, { delay: 0 });

    this.repository.getNextButton().click();
  };

  private createDummyCheckoutAddress = (): Omit<Address, 'id_customer_address'> => {
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

interface FillShippingAddressParams {
  idCustomerAddress?: number;
}

interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  zipCode: string;
  city: string;
  company: string;
  phone: string;
}
