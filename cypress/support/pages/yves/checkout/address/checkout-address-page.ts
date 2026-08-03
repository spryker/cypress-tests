import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CheckoutAddressRepository } from './checkout-address-repository';

@injectable()
@autoWired
export class CheckoutAddressPage extends YvesPage {
  @inject(REPOSITORIES.CheckoutAddressRepository) private repository: CheckoutAddressRepository;

  protected PAGE_URL = '/checkout/address';

  // CI-only probe (temporary): captured when an address item is skipped because it already
  // carries a service point, dumped in the assertion message before the Next click so the
  // failing state is readable straight from the CI log.
  private probeStateOnSkip: string | null = null;

  private collectAddressStepState = (doc: Document): Record<string, unknown> => {
    const radioGroups: Record<string, string[]> = {};
    doc.querySelectorAll<HTMLInputElement>('input.js-address__validator-trigger').forEach((radio) => {
      const key = radio.name || 'UNNAMED';
      (radioGroups[key] = radioGroups[key] || []).push(
        `${radio.value}${radio.checked ? ':checked' : ''}${radio.disabled ? ':disabled' : ''}`
      );
    });

    const dropdowns: string[] = [];
    doc.querySelectorAll<HTMLSelectElement>('select.js-address__address-select').forEach((select) => {
      dropdowns.push(
        `${select.name}=${select.value || 'EMPTY'}${select.closest('.is-hidden') ? ':in-hidden' : ''}`
      );
    });

    const emptyRequired: string[] = [];
    doc
      .querySelectorAll<HTMLInputElement | HTMLSelectElement>(
        '.js-address__address-form select[required], .js-address__address-form input[required]'
      )
      .forEach((field) => {
        if (!field.value) {
          emptyRequired.push(`${field.name}${field.closest('.is-hidden') ? ':in-hidden' : ''}`);
        }
      });

    const nextButton = doc.querySelector<HTMLButtonElement>('.js-address__form-submit');
    const billingSameAsShipping = doc.querySelector<HTMLInputElement>(
      'input[name="addressesForm[billingSameAsShipping]"]'
    );
    const shipmentTypeGroupsHtml = Array.from(doc.querySelectorAll('[id$="_shipmentType_key"]')).map((element) =>
      element.outerHTML.replace(/\s+/g, ' ').slice(0, 900)
    );

    return {
      nextDisabled: nextButton ? nextButton.disabled : 'NO-BUTTON',
      billingSameAsShippingChecked: billingSameAsShipping ? billingSameAsShipping.checked : 'NO-CHECKBOX',
      radioGroups,
      dropdowns,
      emptyRequired,
      shipmentTypeGroupsHtml,
    };
  };

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
          cy.document().then((doc) => {
            this.probeStateOnSkip = JSON.stringify(this.collectAddressStepState(doc));
          });

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

    if (this.probeStateOnSkip) {
      this.repository.getNextButton().should(($button: JQuery<HTMLElement>) => {
        const stateBeforeClick = JSON.stringify(this.collectAddressStepState($button[0].ownerDocument));
        expect(
          $button.prop('disabled'),
          `PROBE onSkip=${this.probeStateOnSkip} beforeClick=${stateBeforeClick}`
        ).to.be.false;
      });
    }

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
