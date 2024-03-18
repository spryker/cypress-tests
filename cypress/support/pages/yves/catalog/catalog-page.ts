import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '../yves-page';
import { CatalogRepository } from './catalog-repository';

@injectable()
@autoWired
export class CatalogPage extends YvesPage {
  @inject(REPOSITORIES.CatalogRepository) private repository: CatalogRepository;

  protected PAGE_URL = '/search';

  openFirstSuggestedProduct = (query: string): void => {
    this.repository.getSearchInput().clear().type(query);
    this.repository.getFirstSuggestedProduct().click();
  };

  selectSoldByProductOffer = (productOfferReference: string): void => {
    this.repository.getSoldByProductOfferRadios().check(productOfferReference, { force: true });
  };

  createMerchantRelationRequest = (productOfferReference: string): void => {
    this.repository
      .getSoldByProductOffers()
      .children()
      .each(($productOffer) => {
        if ($productOffer.find('input[type="radio"]').attr('value') === productOfferReference) {
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
}
