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

  private UPDATE_SUCCESS_MESSAGE = 'Discount successfully updated.';

  // Markup rendered by @spryker/jquery-query-builder and select2, identical in every repository.
  private CONDITION_BUILDER_SELECTOR = '#builder_condition';

  private QUERY_BUILDER_ADD_RULE_SELECTOR = '[data-add="rule"]';

  private QUERY_BUILDER_RULE_SELECTOR = '.rule-container';

  private QUERY_BUILDER_FILTER_SELECTOR = '.rule-filter-container select';

  private QUERY_BUILDER_OPERATOR_SELECTOR = '.rule-operator-container select';

  private SELECT2_SELECTION_SELECTOR = '.rule-value-container .select2-selection';

  private SELECT2_SEARCH_FIELD_SELECTOR = '.select2-container--open .select2-search__field';

  private SELECT2_OPTION_SELECTOR = '.select2-results__option';

  createDiscount = (data: DiscountFormData): void => {
    this.fillGeneralAndCalculation(data);

    this.openTab(this.CONDITIONS_TAB);
    this.repository.getConditionGetButton().click();

    cy.document().then((doc) => {
      doc.querySelector(this.repository.getDecisionRuleContainerSelector())?.classList.remove('hidden');
    });

    this.repository.getDecisionRuleQueryStringInput().should('be.visible').clear().type(data.applyWhen);

    this.repository.getCreateButton().click();
  };

  createDiscountWithSuggestedConditionValue = (
    data: Omit<DiscountFormData, 'applyWhen'>,
    condition: SuggestedConditionValue
  ): void => {
    this.fillGeneralAndCalculation(data);

    this.openTab(this.CONDITIONS_TAB);
    // The builder opens with one empty rule; a second one would stay empty and fail validation on save.
    cy.get(this.CONDITION_BUILDER_SELECTOR).then(($builder) => {
      if ($builder.find(this.QUERY_BUILDER_RULE_SELECTOR).length === 0) {
        cy.wrap($builder).find(this.QUERY_BUILDER_ADD_RULE_SELECTOR).first().click();
      }
    });
    cy.get(this.CONDITION_BUILDER_SELECTOR)
      .find(this.QUERY_BUILDER_RULE_SELECTOR)
      .last()
      .within((): void => {
        cy.get(this.QUERY_BUILDER_FILTER_SELECTOR).select(condition.field);
        cy.get(this.SELECT2_SELECTION_SELECTOR).click();
      });

    cy.intercept('GET', `${condition.suggestUrl}*`).as('valueSuggestion');
    cy.get(this.SELECT2_SEARCH_FIELD_SELECTOR).type(condition.searchTerm);
    cy.wait('@valueSuggestion');
    cy.contains(this.SELECT2_OPTION_SELECTOR, condition.value).click();

    this.repository.getCreateButton().click();
  };

  submitWithoutChanges = (): void => {
    this.repository.getCreateButton().click();
  };

  getDecisionRuleQueryString = (): Cypress.Chainable<string> =>
    this.repository.getDecisionRuleQueryStringInput().invoke('val');

  getDecisionRuleOperators = (): Cypress.Chainable<Array<string>> =>
    cy
      .get(this.CONDITION_BUILDER_SELECTOR)
      .find(this.QUERY_BUILDER_OPERATOR_SELECTOR)
      .then(($selects): Array<string> => $selects.toArray().map((select) => (select as HTMLSelectElement).value));

  getDecisionRuleSelectedValues = (): Cypress.Chainable<Array<string>> =>
    cy
      .get(this.CONDITION_BUILDER_SELECTOR)
      .find('.rule-value-container select option:selected')
      .then(($options): Array<string> => $options.toArray().map((option) => (option as HTMLOptionElement).value));

  private fillGeneralAndCalculation = (data: Omit<DiscountFormData, 'applyWhen'>): void => {
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
  };

  getCreatePageUrl = (): string => this.PAGE_URL;

  getUpdateSuccessMessage = (): Cypress.Chainable => cy.contains(this.UPDATE_SUCCESS_MESSAGE);

  getUnknownConditionValueError = (field: string, values: Array<string>): Cypress.Chainable =>
    cy.contains(`Could not find "${values.join('", "')}" for field "${field}".`);

  visitEdit = (idDiscount: number): void => {
    cy.visitBackoffice(this.editUrl(idDiscount));
  };

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

interface SuggestedConditionValue {
  field: string;
  suggestUrl: string;
  searchTerm: string;
  value: string;
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
