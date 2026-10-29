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

  getBudgetAmountInput = (): Cypress.Chainable => this.repository.getBudgetAmountInput();

  getBudgetPeriodSelect = (): Cypress.Chainable => this.repository.getBudgetPeriodSelect();

  getSellerCheckbox = (reference: string): Cypress.Chainable => this.repository.getSellerCheckbox(reference);

  getSellerCheckboxes = (): Cypress.Chainable => this.repository.getSellerCheckboxes();

  getCategoryCheckbox = (key: string): Cypress.Chainable => this.repository.getCategoryCheckbox(key);

  getCategoryCheckboxes = (): Cypress.Chainable => this.repository.getCategoryCheckboxes();

  getConstraintError = (): Cypress.Chainable => this.repository.getConstraintError();

  setScope = (scope: string, isGranted: boolean): void => {
    if (isGranted) {
      this.repository.getScopeCheckbox(scope).check({ force: true });

      return;
    }

    this.repository.getScopeCheckbox(scope).uncheck({ force: true });
  };

  enterOrderLimit = (amount: string): void => {
    this.repository.getOrderLimitInput().clear();

    if (amount !== '') {
      this.repository.getOrderLimitInput().type(amount);
    }
  };

  enterBudget = (amount: string, period?: string): void => {
    this.repository.getBudgetAmountInput().clear();

    if (amount !== '') {
      this.repository.getBudgetAmountInput().type(amount);
    }

    if (period !== undefined) {
      this.repository.getBudgetPeriodSelect().select(period);
    }
  };

  setSeller = (reference: string, isAllowed: boolean): void => {
    if (isAllowed) {
      this.repository.getSellerCheckbox(reference).check({ force: true });

      return;
    }

    this.repository.getSellerCheckbox(reference).uncheck({ force: true });
  };

  setCategory = (key: string, isAllowed: boolean): void => {
    if (isAllowed) {
      this.repository.getCategoryCheckbox(key).check({ force: true });

      return;
    }

    this.repository.getCategoryCheckbox(key).uncheck({ force: true });
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
