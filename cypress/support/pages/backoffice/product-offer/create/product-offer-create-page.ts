import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductOfferCreateRepository } from './product-offer-create-repository';

interface CreateProductOfferParams {
  sku: string;
  validFrom?: string;
  validTo?: string;
  store: string;
  servicePointId?: number;
  serviceUuid?: string;
  isNeverOfStock?: boolean;
  shipmentTypeId?: number;
}

interface ProductOffer {
  status: string;
  stores: string[];
  productSku: string;
  validFrom: string;
  validTo: string;
  quantity: number;
  isNeverOfStock: boolean;
  shipmentType?: string;
}

@injectable()
@autoWired
export class ProductOfferCreatePage extends BackofficePage {
  @inject(ProductOfferCreateRepository) private repository: ProductOfferCreateRepository;

  protected PAGE_URL = '/product-offer-gui/create';

  create = (params: CreateProductOfferParams): Cypress.Chainable<ProductOffer> => {
    const productOffer: ProductOffer = {
      status: '',
      stores: [],
      productSku: params.sku,
      validFrom: '',
      validTo: '',
      quantity: 0,
      isNeverOfStock: false,
    };

    this.searchAndSelectProduct(params.sku);
    this.fillOfferDetails(params, productOffer);
    this.saveOffer();

    return cy.wrap(productOffer);
  };

  getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear() + 1;

    return `${year}-05-07`;
  }

  getFutureDate(): string {
    const date = new Date();
    const year = date.getFullYear() + 1;

    return `${year}-10-20`;
  }

  assertSuccessMessage = (): Cypress.Chainable => {
    return this.repository.getSuccessMessageBox().should('exist');
  };

  private searchAndSelectProduct = (sku: string): void => {
    this.repository.getProductSearchField().clear().invoke('val', sku).trigger('input');

    cy.intercept('GET', `**/self-service-portal/create-offer/table**${sku}**`).as('createOfferTable');
    cy.wait('@createOfferTable');

    cy.get(this.repository.getTableRowsSelector())
      .first()
      .within(() => {
        cy.get(this.repository.getCreateOfferLinkSelector()).click();
      });
  };

  private fillOfferDetails = (params: CreateProductOfferParams, productOffer: ProductOffer): void => {
    this.repository.getStoreField().select(params.store, { force: true });
    productOffer.stores = [params.store];

    this.repository.getStockQuantityField().type('1');
    productOffer.quantity = 1;

    if (params.servicePointId) {
      this.fillServiceDetails(params);
    }

    if (params.validTo) {
      this.repository.getValidToField().type(params.validTo);
      productOffer.validTo = params.validTo;
    }

    if (params.validFrom) {
      this.repository.getValidFromField().type(params.validFrom);
      productOffer.validFrom = params.validFrom;
    }

    if (params.isNeverOfStock) {
      this.repository.getIsNeverOfStockCheckbox().check();
      productOffer.isNeverOfStock = true;
    }

    if (params.shipmentTypeId) {
      this.repository.getShipmentTypesField().select(params.shipmentTypeId, { force: true });
    }
  };

  private fillServiceDetails = (params: CreateProductOfferParams): void => {
    this.repository.getServiceField().should('be.disabled');
    if (params.servicePointId !== undefined) {
      this.repository.getServicePointField().select(params.servicePointId.toString(), { force: true });
    }
    this.repository.getServiceField().should('not.be.disabled');

    if (params.serviceUuid) {
      this.repository.getServiceField().select(params.serviceUuid, { force: true });
    }
  };

  private saveOffer = (): void => {
    this.repository.getSaveButton().click();
  };
}
