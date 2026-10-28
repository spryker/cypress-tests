import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { CustomerGroupViewRepository } from './customer-group-view-repository';

@injectable()
@autoWired
export class CustomerGroupViewPage extends BackofficePage {
  @inject(REPOSITORIES.CustomerGroupViewRepository) private repository: CustomerGroupViewRepository;

  protected PAGE_URL = '/customer-group/view';

  visitViewPage = (idCustomerGroup: number): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?id-customer-group=${idCustomerGroup}`);
  };

  getSuccessMessage = (): Cypress.Chainable => this.repository.getSuccessMessage();

  getCustomerTable = (): Cypress.Chainable => this.repository.getCustomerTable();

  getCompanyTable = (): Cypress.Chainable => this.repository.getCompanyTable();

  getCompanyTableCheckboxes = (): Cypress.Chainable => this.repository.getCompanyTableCheckboxes();

  getBusinessUnitTable = (): Cypress.Chainable => this.repository.getBusinessUnitTable();

  getBusinessUnitTableCheckboxes = (): Cypress.Chainable => this.repository.getBusinessUnitTableCheckboxes();

  getCompanyEditButton = (idCompany: number): Cypress.Chainable => this.repository.getCompanyEditButton(idCompany);

  getBusinessUnitEditButton = (idCompanyBusinessUnit: number): Cypress.Chainable =>
    this.repository.getBusinessUnitEditButton(idCompanyBusinessUnit);
}
