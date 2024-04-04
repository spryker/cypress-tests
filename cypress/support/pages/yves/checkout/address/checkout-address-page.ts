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

  fillMultiShippingAddress = (params?: FillShippingAddressParams): void => {
    this.repository.getMultiShipmentTriggerButton().click();

    this.repository
      .getMultiShipmentAddressItemElement()
      .children()
      .each(($addressItem, index) => {
        const checkoutAddress = this.createDummyCheckoutAddress();

        this.repository.getMultiShipmentAddressItemDeliveryRadio($addressItem, index).click({ force: true });

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

  fillBillingAddress = (): void => {
    const checkoutAddress = this.createDummyCheckoutAddress();
    this.repository.getSelectBillingAddressField().select('0', { force: true });

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
