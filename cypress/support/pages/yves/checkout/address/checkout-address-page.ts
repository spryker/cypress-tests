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
        const hasServicePointUuid = Boolean(
          this.repository.getMultiShipmentAddressItemServicePointUuidValue?.($addressItem, index)
        );

        if (
          params?.servicePointSelection &&
          (hasServicePointUuid || $addressItem.text().includes(params.servicePointSelection.productName))
        ) {
          this.selectServicePointForAddressItem($addressItem, index, params.servicePointSelection);

          return;
        }

        if (params?.skipServicePointAddressOverride && hasServicePointUuid) {
          // The address step renders "Next" disabled and only re-enables it when
          // validate-next-checkout-step re-evaluates, which needs a change event on one of the
          // item's inputs. Leaving the item completely untouched keeps the button disabled, so
          // check the shipment type the already-selected service point implies.
          this.checkAddressItemShipmentType(index, params.shipmentType);

          return;
        }

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

  fillSingleCheckoutAddress = (params?: FillShippingAddressParams): void => {
    const checkoutAddress = this.createDummyCheckoutAddress();

    this.repository.getMultiShipmentAddressItemElement().then(($element: JQuery<HTMLElement>) => {
      if (!$element) {
        return;
      }

      cy.wrap($element)
        .children()
        .first()
        .then(($addressItem: JQuery<HTMLElement>) => {
          if (params?.idCustomerAddress !== undefined) {
            this.repository
              .getMultiShipmentAddressItemAddressField($addressItem, 0)
              .select(params.idCustomerAddress.toString(), { force: true });
          }

          if (params?.idCustomerAddress !== 0) {
            return;
          }

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

          this.repository
            .getMultiShipmentAddressItemAddressCompanyField($addressItem, 0)
            .clear()
            .type(checkoutAddress.company, { delay: 0 });
          this.repository
            .getMultiShipmentAddressItemAddressPhoneField($addressItem, 0)
            .clear()
            .type(checkoutAddress.phone, { delay: 0 });
        });
    });
    this.fillBillingAddress();
    this.repository.getNextButton().click();
  };

  selectServicePointForAddressItem = (
    $addressItem: JQuery<HTMLElement>,
    index: number,
    servicePointSelection: ServicePointSelection
  ): void => {
    if (this.isRepository('suite')) {
      this.repository
        .getMultiShipmentAddressItemShipmentTypeRadio?.(index, servicePointSelection.shipmentTypeKey)
        .click({ force: true });
    }

    this.repository.getMultiShipmentAddressItemSelectServicePointButton?.($addressItem).first().click({ force: true });
    this.repository.getServicePointFinderInput?.().clear().type(servicePointSelection.servicePointName);
    this.repository.getServicePointFinderListItem?.(servicePointSelection.servicePointName).first().click();

    this.repository.getMultiShipmentAddressItemServicePointUuidInput?.(index).should(($input: JQuery<HTMLElement>) => {
      const hasUuid = Boolean(($input.val() as string) || '');
      const itemText = $input.closest('[data-qa="component address-item-form-field-list"] > *').text() || '';
      const showsLocation = itemText.includes(servicePointSelection.servicePointName);
      expect(hasUuid || showsLocation, 'service point selection is applied to the address item').to.be.true;
    });

    if (this.isRepository('suite')) {
      this.repository
        .getMultiShipmentAddressItemShipmentTypeRadio?.(index, servicePointSelection.shipmentTypeKey)
        .should('be.checked');
    }
  };

  private checkAddressItemShipmentType = (index: number, shipmentTypeKey?: string): void => {
    if (!shipmentTypeKey) {
      return;
    }

    // `check()` is a no-op when the radio is already checked, and a radio only fires `change` when
    // its value actually changes, so trigger the event explicitly to always re-run the validator.
    this.repository
      .getMultiShipmentAddressItemShipmentTypeRadio?.(index, shipmentTypeKey)
      .check({ force: true })
      .trigger('change', { force: true });
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
  shipmentType?: string;
  skipServicePointAddressOverride?: boolean;
  servicePointSelection?: ServicePointSelection;
}

interface ServicePointSelection {
  productName: string;
  shipmentTypeKey: string;
  servicePointName: string;
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
