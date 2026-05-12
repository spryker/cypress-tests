import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CostCenterUpdateRepository } from './cost-center-update-repository';

@injectable()
@autoWired
export class YvesCostCenterUpdatePage extends YvesPage {
  @inject(REPOSITORIES.YvesCostCenterUpdateRepository)
  private repository: CostCenterUpdateRepository;

  protected PAGE_URL = '/company/cost-center/update';

  visitByUuid = (uuid: string): void => {
    cy.visit(`/company/cost-center/update?uuid=${uuid}`);
  };

  fillName = (name: string): void => {
    this.repository.getNameInput().clear().type(name);
  };

  fillDescription = (description: string): void => {
    this.repository.getDescriptionTextarea().clear().type(description);
  };

  deactivate = (): void => {
    this.repository.getIsActiveCheckbox().uncheck({ force: true });
  };

  activate = (): void => {
    this.repository.getIsActiveCheckbox().check({ force: true });
  };

  submit = (): void => {
    this.repository.getSubmitButton().click();
  };

  assertSuccess = (): void => {
    this.repository.getSuccessFlashMessage().should('be.visible');
  };

  getNameValue = (): Cypress.Chainable<string> => {
    return this.repository.getNameInput().invoke('val') as Cypress.Chainable<string>;
  };
}
