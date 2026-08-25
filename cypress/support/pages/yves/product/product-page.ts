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

  getAddToCartButton = (): Cypress.Chainable => {
    return this.repository.getAddToCartButton();
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
          const $menu = $productOffer.find('details').has(this.repository.getMerchantRelationRequestLinkAttribute());

          if ($menu.length) {
            cy.wrap($menu).find('summary').click();
          }

          cy.wrap($productOffer).find(this.repository.getMerchantRelationRequestLinkAttribute()).click();
        }
      });
  };

  getSoldByProductOffers = (): Cypress.Chainable => {
    return this.repository.getSoldByProductOffers();
  };

  getProductOfferRadio(params: GetProductOfferRadioParams): Cypress.Chainable {
    return this.repository.getSoldByProductOfferRadios().filter(`[value="${params.productOfferReference}"]`);
  }

  getProductOfferPrice(params: GetProductOfferRadioParams): Cypress.Chainable {
    return this.getProductOfferRadio(params)
      .parent()
      .parent()
      .parent()
      .parent()
      .find('[data-qa="component volume-price"]');
  }

  getMerchantRelationRequestLinkAttribute = (): string => {
    return this.repository.getMerchantRelationRequestLinkAttribute();
  };

  getInputRadioSelector = (): string => {
    return this.repository.getInputRadioSelector();
  };

  getProductConfigurationStatus = (): Cypress.Chainable => {
    return this.repository.getProductConfigurationStatus();
  };

  configure = (): void => {
    this.repository.getConfigureButton().click();
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

    this.repository.getServicePointBlockLoader().should('not.be.visible');
  }

  selectServicePoint(servicePointName: string): void {
    this.repository.getSelectServicePointButton().first().click({ force: true });
    this.repository.getServicePointFinderResults?.().should('have.length.at.least', 1);
    this.repository.getServicePointSearchInput().clear({ force: true }).type(servicePointName, { force: true });
    this.repository.getServicePointListItem(servicePointName).first().click({ force: true });
  }

  selectAsset(): void {
    this.repository.getSelectAssetButton().click();
    this.repository.getAssetOptions().first().click();
  }

  getSelectedServicePointName(): Cypress.Chainable {
    return this.repository.getSelectedServicePointName();
  }

  getSspAssetNameBlock = (): Cypress.Chainable => this.repository.getSspAssetNameBlock();

  getAvailabilityStatusBlock = ($productOffer: Cypress.Chainable<JQuery<HTMLElement>>): Cypress.Chainable =>
    $productOffer.get('[data-qa="component status"]');

  getAttachmentsListSelector = (): string => this.repository.getAttachmentsListSelector();

  getAttachmentsList = (): Cypress.Chainable => this.repository.getAttachmentsList();

  getAttachmentItems = (): Cypress.Chainable => this.repository.getAttachmentItems();

  visitProductDetailPage = (params: VisitProductDetailPageParams): void => {
    cy.visit(params.url);
  };

  selectVariantAttribute = (params: SelectVariantAttributeParams): void => {
    this.repository.getVariantAttributeSelect(params.attributeKey).select(params.attributeValue);
  };

  getVariantAttributeOptions = (attributeKey: string): Cypress.Chainable => {
    return this.repository.getVariantAttributeOptions(attributeKey);
  };

  getVariantAttributeSelect = (attributeKey: string): Cypress.Chainable => {
    return this.repository.getVariantAttributeSelect(attributeKey);
  };

  getSelectedVariantAttributeValue = (attributeKey: string): Cypress.Chainable => {
    return this.repository.getSelectedVariantAttributeInput(attributeKey).invoke('val');
  };

  getProductLabels = (): Cypress.Chainable => this.repository.getProductLabels();

  getRelatedProductsCarousel = (): Cypress.Chainable => this.repository.getRelatedProductsCarousel();

  getRelatedProductsSection = (): Cypress.Chainable => cy.get(this.repository.getRelatedProductsSectionSelector());

  getProductDetailPrice = (): Cypress.Chainable => this.repository.getProductDetailPrice();

  getProductOptionSelects = (): Cypress.Chainable => this.repository.getProductOptionSelects();

  getProductDetailOriginalPrice = (): Cypress.Chainable => this.repository.getProductDetailOriginalPrice();

  getAlternativeProductsSlider = (): Cypress.Chainable => this.repository.getAlternativeProductsSlider();

  setQuantity = (params: SetQuantityParams): void => {
    this.repository.setQuantity(params.quantity);
  };

  selectSalesUnit = (params: SelectSalesUnitParams): void => {
    this.repository.selectSalesUnit(params.salesUnitName);
  };

  getMeasurementUnitChoice = (): Cypress.Chainable => this.repository.getMeasurementUnitChoice();

  setAmount = (params: SetAmountParams): void => {
    this.repository.setAmount(params.amount);
  };

  getPackagingUnitChoice = (): Cypress.Chainable => this.repository.getPackagingUnitChoice();

  getBundleItems = (): Cypress.Chainable => this.repository.getBundleItems();
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

interface GetProductOfferRadioParams {
  productOfferReference: string;
}

interface VisitProductDetailPageParams {
  url: string;
}

interface SetAmountParams {
  amount: number;
}

interface SelectSalesUnitParams {
  salesUnitName: string;
}

interface SetQuantityParams {
  quantity: number;
}

interface SelectVariantAttributeParams {
  attributeKey: string;
  attributeValue: string;
}
