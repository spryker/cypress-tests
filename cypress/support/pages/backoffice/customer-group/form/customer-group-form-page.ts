import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { CustomerGroupFormRepository } from './customer-group-form-repository';

@injectable()
@autoWired
export class CustomerGroupFormPage extends BackofficePage {
  @inject(REPOSITORIES.CustomerGroupFormRepository) private repository: CustomerGroupFormRepository;

  protected PAGE_URL = '/customer-group/add';

  visitEditPage = (idCustomerGroup: number): void => {
    cy.visitBackoffice(this.getEditPageUrl(idCustomerGroup));
  };

  getEditPageUrl = (idCustomerGroup: number): string => `/customer-group/edit?id-customer-group=${idCustomerGroup}`;

  getBusinessUnitsTab = (): Cypress.Chainable => this.repository.getBusinessUnitsTab();

  getSuccessMessage = (): Cypress.Chainable => this.repository.getSuccessMessage();

  fillName = (name: string): void => {
    this.repository.getNameInput().clear().type(name);
  };

  assignCustomer = (params: AssignCustomerParams): void => {
    this.repository.getCustomersTab().click();

    this.repository.getAvailableCustomersSearchInput().clear().type(params.searchTerm);
    this.repository.getAvailableCustomerCheckbox(params.idCustomer).check();

    this.repository.getCustomersToBeAssignedTab().click();
    this.repository.getCustomerToBeAssignedRemoveLink(params.idCustomer).should('exist');
  };

  assignCompany = (params: AssignCompanyParams): void => {
    this.repository.getCompaniesTab().click();

    this.repository.getAvailableCompaniesSearchInput().clear().type(params.searchTerm);
    this.repository.getAvailableCompanyCheckbox(params.idCompany).check();

    this.repository.getCompanyToBeAssignedRemoveLink(params.idCompany).should('exist');
  };

  deassignCompany = (idCompany: number): void => {
    this.repository.getCompaniesTab().click();
    this.repository.getAssignedCompanyCheckbox(idCompany).check();

    this.repository.getCompanyToBeDeassignedRemoveLink(idCompany).should('exist');
  };

  assignBusinessUnit = (params: AssignBusinessUnitParams): void => {
    this.repository.getBusinessUnitsTab().click();

    this.repository.getAvailableBusinessUnitsSearchInput().clear().type(params.searchTerm);
    this.repository.getAvailableBusinessUnitCheckbox(params.idCompanyBusinessUnit).check();

    this.repository.getBusinessUnitToBeAssignedRemoveLink(params.idCompanyBusinessUnit).should('exist');
  };

  deassignBusinessUnit = (idCompanyBusinessUnit: number): void => {
    this.repository.getBusinessUnitsTab().click();
    this.repository.getAssignedBusinessUnitCheckbox(idCompanyBusinessUnit).check();

    this.repository.getBusinessUnitToBeDeassignedRemoveLink(idCompanyBusinessUnit).should('exist');
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}

interface AssignCustomerParams {
  idCustomer: number;
  searchTerm: string;
}

interface AssignCompanyParams {
  idCompany: number;
  searchTerm: string;
}

interface AssignBusinessUnitParams {
  idCompanyBusinessUnit: number;
  searchTerm: string;
}
