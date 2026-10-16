import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CompanyUserCreateRepository } from './company-user-create-repository';

@injectable()
@autoWired
export class CompanyUserCreatePage extends BackofficePage {
  @inject(CompanyUserCreateRepository) private repository: CompanyUserCreateRepository;

  protected PAGE_URL = '/company-user-gui/create-company-user';

  /**
   * The company has to be picked first and on its own: anything already filled into the business unit
   * or role fields is thrown away when it changes.
   */
  create = (params: CreateParams): void => {
    this.selectCompany(params.companyName);
    this.selectBusinessUnit(params.businessUnitName);

    this.repository.getEmailInput().clear().type(params.email);
    this.repository.getSalutationSelect().select(params.salutation, { force: true });
    this.repository.getFirstNameInput().clear().type(params.firstName);
    this.repository.getLastNameInput().clear().type(params.lastName);
    this.repository.getGenderSelect().select(params.gender, { force: true });
    this.repository.getRoleCheckbox(params.roleName).check({ force: true });

    this.repository.getSubmitButton().click();
  };

  private selectCompany = (companyName: string): void => {
    cy.intercept('GET', '**/company-gui/suggest*').as('companySuggest');
    cy.intercept('GET', '**/company-role-gui/suggest*').as('companyRoleSuggest');

    this.repository.getCompanySelect().siblings('.select2-container').find('.select2-selection').click();
    cy.get('.select2-dropdown .select2-search__field').type(companyName);
    cy.wait('@companySuggest');
    cy.contains('.select2-dropdown .select2-results__option', companyName).click();

    // Selecting the company is what triggers the role re-fetch; the checkboxes do not exist before it.
    cy.wait('@companyRoleSuggest');
  };

  private selectBusinessUnit = (businessUnitName: string): void => {
    cy.intercept('GET', '**/company-business-unit-gui/suggest*').as('businessUnitSuggest');

    this.repository.getBusinessUnitSelect().siblings('.select2-container').find('.select2-selection').click();
    cy.get('.select2-dropdown .select2-search__field').type(businessUnitName);
    cy.wait('@businessUnitSuggest');
    cy.contains('.select2-dropdown .select2-results__option', businessUnitName).click();
  };
}

interface CreateParams {
  companyName: string;
  businessUnitName: string;
  roleName: string;
  email: string;
  salutation: string;
  firstName: string;
  lastName: string;
  gender: string;
}
