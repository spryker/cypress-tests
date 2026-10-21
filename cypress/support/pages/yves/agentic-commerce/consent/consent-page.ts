import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '../../yves-page';
import { ConsentRepository } from './consent-repository';

@injectable()
@autoWired
export class ConsentPage extends YvesPage {
  @inject(ConsentRepository) private repository: ConsentRepository;

  protected PAGE_URL = '/connect/consent';

  getConsentBox = (): Cypress.Chainable => this.repository.getConsentBox();

  getPrincipalSelect = (): Cypress.Chainable => this.repository.getPrincipalSelect();

  getUnverifiedTrustNotice = (): Cypress.Chainable => this.repository.getUnverifiedTrustNotice();

  getNoScopesNotice = (): Cypress.Chainable => this.repository.getNoScopesNotice();

  getClientLogo = (): Cypress.Chainable => this.getConsentBox().find(this.repository.getClientLogoSelector());

  getAllowButton = (): Cypress.Chainable => this.getConsentBox().find(this.repository.getAllowButtonSelector());

  getDenyButton = (): Cypress.Chainable => this.repository.getDenyButton();

  getScopeCheckbox = (scope: string): Cypress.Chainable => this.repository.getScopeCheckbox(scope);

  getOrderLimitInput = (): Cypress.Chainable => this.repository.getOrderLimitInput();

  getConstraintError = (): Cypress.Chainable => this.repository.getConstraintError();

  setScope = (scope: string, isGranted: boolean): void => {
    if (isGranted) {
      this.repository.getScopeCheckbox(scope).check();

      return;
    }

    this.repository.getScopeCheckbox(scope).uncheck();
  };

  enterOrderLimit = (amount: string): void => {
    this.repository.getOrderLimitInput().clear();

    if (amount !== '') {
      this.repository.getOrderLimitInput().type(amount);
    }
  };

  selectStore = (storeName: string): void => {
    this.repository.getStoreSelect().select(storeName);
  };

  allow = (): void => {
    this.repository.getAllowButton().click();
  };

  deny = (): void => {
    this.repository.getDenyButton().click();
  };
}
