import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage, TableRowGetter } from '@pages/backoffice';
import { DiscountRepository } from './discount-repository';

@injectable()
@autoWired
export class DiscountPage extends BackofficePage {
  @inject(REPOSITORIES.DiscountRepository) private repository: DiscountRepository;

  protected PAGE_URL = '/discount/index/create';

  private LIST_PAGE_URL = '/discount/index/list';

  private EDIT_PAGE_URL = '/discount/index/edit';

  private VIEW_PAGE_URL = '/discount/index/view';

  private GENERAL_TAB = 'tab-content-general';

  private DISCOUNT_TAB = 'tab-content-discount';

  private CONDITIONS_TAB = 'tab-content-conditions';

  createDiscount = (data: DiscountFormData): void => {
    this.visit();

    if (data.type) {
      this.repository.getTypeSelect().select(data.type, { force: true });
    }

    if (data.name) {
      this.repository.getNameInput().clear().type(data.name);
    }

    if (data.description) {
      this.repository.getDescriptionInput().clear().type(data.description);
    }

    if (data.isExclusive !== undefined) {
      this.repository.getExclusiveRadio(data.isExclusive).check({ force: true });
    }

    if (data.validFrom) {
      this.repository.getValidFromInput().clear().type(data.validFrom);
    }

    if (data.validTo) {
      this.repository.getValidToInput().clear().type(data.validTo);
    }

    this.openTab(this.DISCOUNT_TAB);

    if (data.calculatorPlugin) {
      this.repository.getCalculatorPluginSelect().select(data.calculatorPlugin, { force: true });
    }

    if (data.amount) {
      this.repository.getGrossAmountInput().clear().type(data.amount);
    }

    this.repository.getCalculationGetButton().click();

    if (data.applyTo) {
      this.repository.getCollectorQueryStringInput().clear().type(data.applyTo);
    }

    this.openTab(this.CONDITIONS_TAB);
    this.repository.getConditionGetButton().click();

    cy.document().then((doc) => {
      doc.querySelector(this.repository.getDecisionRuleContainerSelector())?.classList.remove('hidden');
    });

    this.repository.getDecisionRuleQueryStringInput().should('be.visible').clear().type(data.applyWhen);

    this.repository.getCreateButton().click();
  };

  getCreatePageUrl = (): string => this.PAGE_URL;

  getSuccessMessage = (): Cypress.Chainable => cy.contains(this.repository.getSuccessMessage());

  getBlankValueError = (): Cypress.Chainable => cy.contains(this.repository.getBlankValueError());

  getActiveTabError = (): Cypress.Chainable => this.repository.getActiveTabError();

  getNameErrorContainer = (): Cypress.Chainable => this.repository.getNameErrorContainer();

  openGeneralTab = (): void => {
    this.openTab(this.GENERAL_TAB);
  };

  visitList = (): void => {
    cy.visitBackoffice(this.LIST_PAGE_URL);
  };

  getListTable = (): Cypress.Chainable => this.repository.getListTable();

  getRowActionLabels = (): Array<string> => this.repository.getRowActionLabels();

  // The discount's own row, so the caller asserts the actions it offers rather than counting matched
  // elements (an element count tracks DOM nesting, not the actions actually rendered).
  getDiscountRowText = (name: string): Cypress.Chainable<string> => this.getDiscountRow(name).invoke('text');

  openEditPageFromList = (name: string, idDiscount: number): void => {
    this.getDiscountRow(name).find(this.repository.getEditActionSelector()).click({ force: true });

    cy.url().should('include', this.editUrl(idDiscount));
    cy.get(this.repository.getHeadingSelector()).should('contain', this.repository.getEditHeading());
  };

  openViewPageFromList = (name: string, idDiscount: number): void => {
    this.getDiscountRow(name).find(this.repository.getViewActionSelector()).click({ force: true });

    cy.url().should('include', this.viewUrl(idDiscount));
    cy.get(this.repository.getHeadingSelector()).should('contain', this.repository.getViewHeading());
    cy.contains(name).should('be.visible');
  };

  // Throws rather than asserting so the lookup stays a page-object concern while still failing loudly
  // with the discount name; the caller only ever receives a real row.
  private getDiscountRow = (name: string): Cypress.Chainable<JQuery<HTMLElement>> =>
    this.findRow(name).then((getRow) => {
      if (getRow === null) {
        throw new Error(`Discount "${name}" was not found in the discount list.`);
      }

      return (getRow as TableRowGetter)();
    });

  private editUrl(idDiscount: number): string {
    return `${this.EDIT_PAGE_URL}?id-discount=${idDiscount}`;
  }

  private viewUrl(idDiscount: number): string {
    return `${this.VIEW_PAGE_URL}?id-discount=${idDiscount}`;
  }

  private openTab(tabContentId: string): void {
    this.repository.getTabLink(tabContentId).click();
  }

  private findRow(name: string): Cypress.Chainable<TableRowGetter | null> {
    this.visitList();

    return this.find({
      searchQuery: name,
      interceptTableUrl: this.repository.getListTableUrl(),
      expectedToSeeInTable: name,
    });
  }
}

interface DiscountFormData {
  type?: string;
  name?: string;
  description?: string;
  isExclusive?: boolean;
  validFrom?: string;
  validTo?: string;
  calculatorPlugin?: string;
  amount?: string;
  applyTo?: string;
  applyWhen: string;
}
