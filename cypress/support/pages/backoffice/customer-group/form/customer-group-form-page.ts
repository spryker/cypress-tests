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
    cy.visitBackoffice(`/customer-group/edit?id-customer-group=${idCustomerGroup}`);
  };

  fillName = (name: string): void => {
    this.repository.getNameInput().clear().type(name);
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

interface AssignCompanyParams {
  idCompany: number;
  searchTerm: string;
}

interface AssignBusinessUnitParams {
  idCompanyBusinessUnit: number;
  searchTerm: string;
}
