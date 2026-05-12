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
    this.repository.getCompanySelect().siblings('span').find('.select2-selection').click();
    cy.get('.select2-search__field').first().type(companyName, { force: true });
    cy.get('li.select2-results__option').contains(companyName).click();
  };

  selectBusinessUnit = (buName: string): void => {
    this.repository
      .getBusinessUnitSelect()
      .siblings('span')
      .find('.select2-search__field')
      .type(buName, { force: true });
    cy.get('li.select2-results__option').contains(buName).click();
  };

  submit = (): void => {
    this.repository.getSaveButton().click();
  };

  assertSuccess = (): void => {
    this.repository.getSuccessMessage().should('be.visible');
  };
}
