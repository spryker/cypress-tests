import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CostCenterCreateRepository } from './cost-center-create-repository';

@injectable()
@autoWired
export class CostCenterCreatePage extends BackofficePage {
  @inject(CostCenterCreateRepository) private repository: CostCenterCreateRepository;

  protected PAGE_URL = '/purchasing-control/cost-center/create';

  fillName = (name: string): void => {
    this.repository.getNameInput().clear().type(name);
  };

  fillDescription = (description: string): void => {
    this.repository.getDescriptionTextarea().clear().type(description);
  };

  selectCompany = (companyName: string): void => {
    cy.intercept('GET', '**/company-gui/suggest*').as('companySuggest');
    this.repository.getCompanySelect().siblings('.select2-container').find('.select2-selection').click();
    cy.get('.select2-dropdown .select2-search__field').type(companyName);
    cy.wait('@companySuggest');
    cy.contains('.select2-dropdown .select2-results__option', companyName).click();
  };

  selectBusinessUnit = (businessUnitName: string): void => {
    cy.intercept('GET', '**/company-business-unit-gui/suggest*').as('buSearch');
    this.repository.getBusinessUnitSelect().siblings('.select2-container').find('.select2-selection').click();
    cy.get('.select2-search__field:visible').type(businessUnitName);
    cy.wait('@buSearch');
    cy.contains('.select2-results__option', businessUnitName).click();
  };

  submit = (): void => {
    this.repository.getSaveButton().click();
  };

  assertSuccess = (): void => {
    this.repository.getSuccessMessage().should('be.visible');
  };
}
