import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductOfferEditRepository } from './product-offer-edit-repository';

@injectable()
@autoWired
export class ProductOfferEditPage extends BackofficePage {
  @inject(ProductOfferEditRepository) private repository: ProductOfferEditRepository;

  protected PAGE_URL = '/self-service-portal/edit-offer';

  visitOffer = (idProductOffer: number): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?id_product_offer=${idProductOffer}`);
  };

  // The stores field is a multi-select, so the way to take a store away is to re-select the ones
  // that stay rather than to look for a per-store control.
  keepOnlyStores = (storeNames: string[]): void => {
    this.repository.getStoresField().select(storeNames, { force: true });
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}
