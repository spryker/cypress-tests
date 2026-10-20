import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductManagementViewRepository } from './product-management-view-repository';

@injectable()
@autoWired
export class ProductManagementViewPage extends BackofficePage {
  @inject(ProductManagementViewRepository) private repository: ProductManagementViewRepository;

  protected PAGE_URL = '/product-management/view';

  getGeneralInformation = (): Cypress.Chainable => this.repository.getGeneralInformation();

  getMerchantName = (): Cypress.Chainable => this.repository.getGeneralInformationValue('Merchant');

  getApprovalStatus = (): Cypress.Chainable => this.repository.getGeneralInformationValue('Approval status');

  getStoreRelation = (): Cypress.Chainable => this.repository.getGeneralInformationValue('Store relation');

  getSku = (): Cypress.Chainable => this.repository.getGeneralInformationValue('Sku');
}
