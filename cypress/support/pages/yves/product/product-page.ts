import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { ProductRepository } from './product-repository';

@injectable()
@autoWired
export class ProductPage extends YvesPage {
  @inject(REPOSITORIES.ProductRepository) private repository: ProductRepository;

  protected PAGE_URL = '';

  addToCart = (params?: AddToCartParams): void => {
    if (params?.quantity) {
      this.repository.getQuantityInput().invoke('val', params.quantity.toString());
    }

    this.repository.getAddToCartButton().click({ force: true });
  };

  getAddToCartSuccessMessage = (): string => {
    return this.repository.getAddToCartSuccessMessage();
  };

  selectSoldByProductOffer = (params: SelectSoldByProductOfferParams): void => {
    this.repository.getSoldByProductOfferRadios().then(($radios) => {
      const targetRadio = $radios.filter(`[value="${params.productOfferReference}"]`);
      if (targetRadio.length) {
        cy.wrap(targetRadio).check(params.productOfferReference, { force: true });
      } else {
        cy.url().then((currentUrl) => {
          cy.log('Fallback redirect to the product offer page');
          cy.visit(
            currentUrl +
              '?attribute[selected_merchant_reference_type]=product_offer_reference&attribute[selected_merchant_reference]=' +
              params.productOfferReference
          );
        });
      }
    });
  };

  createMerchantRelationRequest = (params: CreateMerchantRelationRequestParams): void => {
    this.repository
      .getSoldByProductOffers()
      .children()
      .each(($productOffer) => {
        if ($productOffer.find('input[type="radio"]').attr('value') === params.productOfferReference) {
          cy.wrap($productOffer).find(this.repository.getMerchantRelationRequestLinkAttribute()).click();
        }
      });
  };

  getSoldByProductOffers = (): Cypress.Chainable => {
    return this.repository.getSoldByProductOffers();
  };

  getMerchantRelationRequestLinkAttribute = (): string => {
    return this.repository.getMerchantRelationRequestLinkAttribute();
  };

  getInputRadioSelector = (): string => {
    return this.repository.getInputRadioSelector();
  };

  getProductConfigurator = (): Cypress.Chainable => {
    return this.repository.getProductConfigurator();
  };

  toggleProductComparisonList = (): void => {
    this.repository.getToggleComparisonListButton().click();
  };

  getAddToComparisonListSuccessMessage = (): string => {
    return this.repository.getAddToComparisonListSuccessMessage();
  };

  getRemoveFromComparisonListSuccessMessage = (): string => {
    return this.repository.getRemoveFromComparisonListSuccessMessage();
  };

  getAddToComparisonListLimitExceededErrorMessage = (): string => {
    return this.repository.getAddToComparisonListLimitExceededErrorMessage();
  };

  selectShipmentType(shipmentTypeName: string): void {
    this.repository.getShipmentTypeRadioButton(shipmentTypeName).click({ force: true });
  }

  selectServicePoint(servicePointName: string): void {
    this.repository.getSelectServicePointButton().first().click();
    this.repository.getServicePointSearchInput().clear().type(servicePointName);
    this.repository.getServicePointListItem(servicePointName).click({ force: true });
  }

  assertServicePointIsSelected(servicePointName: string): void {
    this.repository.getSelectedServicePointName().should('contain', servicePointName);
  }

  getSspAssetNameBlock = (): Cypress.Chainable => this.repository.getSspAssetNameBlock();
}

interface SelectSoldByProductOfferParams {
  productOfferReference: string;
}

interface CreateMerchantRelationRequestParams {
  productOfferReference: string;
}

interface AddToCartParams {
  quantity?: number;
}
