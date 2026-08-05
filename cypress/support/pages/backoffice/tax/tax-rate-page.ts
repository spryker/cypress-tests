import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { TaxRateRepository } from './tax-rate-repository';

@injectable()
@autoWired
export class TaxRatePage extends BackofficePage {
  @inject(REPOSITORIES.TaxRateRepository) private repository: TaxRateRepository;

  protected PAGE_URL = '/tax/rate/create';

  private LIST_PAGE_URL = '/tax/rate/list';

  // The list grid hydrates via AJAX; the empty-state row is the last thing to render.
  private EMPTY_TABLE_TIMEOUT_MS = 10000;

  createTaxRate = (taxRate: TaxRateData): void => {
    this.fillTaxRateForm(taxRate);
    this.repository.getSaveButton().click();
  };

  createTaxRateWithoutSaving = (taxRate: TaxRateData): void => {
    this.fillTaxRateForm(taxRate);
  };

  // Mirrors the Codeception createOneAndTheSameTaxRate: submit identical data twice
  // so the second attempt trips the "already exists" server-side validation.
  createDuplicateTaxRate = (taxRate: TaxRateData): void => {
    this.createTaxRate(taxRate);
    this.createTaxRate(taxRate);
  };

  clickListOfTaxRatesButton = (): void => {
    this.repository.getListOfTaxRatesButton().click();
  };

  getSuccessAlert = (): Cypress.Chainable => this.repository.getSuccessAlert();

  getSuccessMessagePattern = (): RegExp => this.repository.getSuccessMessagePattern();

  getNameBlankError = (): Cypress.Chainable => cy.contains(this.repository.getNameBlankError());

  getCountryBlankError = (): Cypress.Chainable => cy.contains(this.repository.getCountryBlankError());

  getPercentageRangeError = (): Cypress.Chainable => cy.contains(this.repository.getPercentageRangeError());

  getAlreadyExistsError = (): Cypress.Chainable => cy.contains(this.repository.getAlreadyExistsError());

  searchTaxRateOnListPage = (name: string): void => {
    cy.visitBackoffice(this.LIST_PAGE_URL);
    this.repository.getListSearchInput().clear().type(name);
  };

  getEmptyTableMessage = (): Cypress.Chainable =>
    cy.contains(this.repository.getEmptyTableMessage(), { timeout: this.EMPTY_TABLE_TIMEOUT_MS });

  private fillTaxRateForm(taxRate: TaxRateData): void {
    this.visit();

    // Disable native HTML5 validation so the server-side messages become observable
    // (mirrors the Codeception disableBrowserNativeValidation('form') step).
    this.repository.getForm().invoke('attr', 'novalidate', 'novalidate');

    if (taxRate.name) {
      this.repository.getNameInput().clear().type(taxRate.name);
    }

    if (taxRate.country) {
      this.repository.getCountrySelect().select(taxRate.country, { force: true });
    }

    this.repository.getPercentageInput().clear().type(taxRate.percentage);
  }
}

interface TaxRateData {
  name: string;
  country: string;
  percentage: string;
}
