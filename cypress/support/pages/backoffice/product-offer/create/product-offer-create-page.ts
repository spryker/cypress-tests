import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductOfferCreateRepository } from './product-offer-create-repository';

@injectable()
@autoWired
export class ProductOfferCreatePage extends BackofficePage {
  @inject(ProductOfferCreateRepository) private repository: ProductOfferCreateRepository;

  protected PAGE_URL = '/product-offer-gui/create';

  create = (params: CreateProductOfferParams): ProductOffer => {
    const productOffer: ProductOffer = {
      status: '',
      stores: [],
      productSku: '',
      validFrom: '',
      validTo: '',
      quantity: 0,
      isNeverOfStock: false,
    };

    this.repository
      .getproductSearchField()
      .clear()
      .invoke('val', params.sku)
      .trigger('input')
      .then(() => {
        cy.intercept('GET', '**/self-service-portal/create-offer/table**' + params.sku + '**').as('createOfferTable');
        cy.wait('@createOfferTable');

        cy.get(this.repository.getTableRowsSelector())
          .first()
          .within(() => {
            cy.get(this.repository.getCreateOfferLinkSelector()).click();
          });

        this.repository.getStoreField().select(params.store, { force: true });
        productOffer.stores = [params.store];

        this.repository.getStockQuantityField().type('1');
        productOffer.quantity = 1;
        this.repository.getServiceField().should('be.disabled');
        if (params.servicePointId) {
          this.repository.getServicePointField().select(params.servicePointId.toString(), { force: true });
          this.repository.getServiceField().should('not.be.disabled');

          if (params.serviceUuid) {
            this.repository.getServiceField().select(params.serviceUuid, { force: true });
          }

          if (params.validFrom) {
            this.repository.getValidFromField().type(params.validFrom);
            productOffer.validFrom = params.validFrom;
          }
        }

        if (params.validTo) {
          this.repository.getValidToField().type(params.validTo);
          productOffer.validTo = params.validTo;
        }

        if (params.isNeverOfStock) {
          this.repository.getIsNeverOfStockCheckbox().check();
          productOffer.isNeverOfStock = true;
        }

        if (params.shipmentTypeId) {
          this.repository.getShipmentTypesField().select(params.shipmentTypeId, { force: true });
        }

        this.repository.getSaveButton().click();
      });

    return productOffer;
  };

  getSuccessMessageSelector = (): Cypress.Chainable => {
    return this.repository.getSuccessMessageBox();
  };
}

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
