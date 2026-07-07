import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductOfferViewRepository } from './product-offer-view-repository';

@injectable()
@autoWired
export class ProductOfferViewPage extends BackofficePage {
  @inject(ProductOfferViewRepository) private repository: ProductOfferViewRepository;

  protected PAGE_URL = '/product-offer-gui/view';

  getApprovalStatusContainer = (): Cypress.Chainable => this.repository.getApprovalStatusContainer();

  getStatusContainer = (): Cypress.Chainable => this.repository.getStatusContainer();

  getProductSkuContainer = (): Cypress.Chainable => this.repository.getProductSkuContainer();

  getMerchantNameContainer = (): Cypress.Chainable => this.repository.getMerchantNameContainer();

  getStoreContainer = (): Cypress.Chainable => this.repository.getStoreContainer();

  getValidFromContainer = (): Cypress.Chainable => this.repository.getValidFromContainer();

  getValidToContainer = (): Cypress.Chainable => this.repository.getValidToContainer();

  getServicePointContainer = (): Cypress.Chainable => this.repository.getProductOfferServicePointContainer();

  getStockTableRows = (): Cypress.Chainable => this.repository.getStockTableRows();

  getStockNameCell = (row: number): Cypress.Chainable => this.repository.getStockNameCell(row);

  getStockQuantityCell = (row: number): Cypress.Chainable => this.repository.getStockQuantityCell(row);

  getStockNeverOutOfStockCell = (row: number): Cypress.Chainable => this.repository.getStockNeverOutOfStockCell(row);
}
