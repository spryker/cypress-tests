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

  assertSuccessMessage = (): void => {
    cy.contains(this.repository.getSuccessMessage()).should('be.visible');
  };

  assertNoSuccessMessage = (): void => {
    cy.contains(this.repository.getSuccessMessage()).should('not.exist');
  };

  assertOnCreatePage = (): void => {
    cy.url().should('include', this.PAGE_URL);
  };

  assertGeneralTabValidationError = (): void => {
    this.openTab(this.GENERAL_TAB);
    this.repository.getActiveTabError().should('be.visible');
    cy.contains(this.repository.getBlankValueError()).should('be.visible');
    this.repository.getNameErrorContainer().should('contain', 'Name');
  };

  assertDiscountTabValidationError = (): void => {
    this.openTab(this.DISCOUNT_TAB);
    this.repository.getActiveTabError().should('be.visible');
    cy.contains(this.repository.getBlankValueError()).should('be.visible');
  };

  assertListTableIsShown = (): void => {
    cy.visitBackoffice(this.LIST_PAGE_URL);
    this.repository.getListTable().should('exist');
  };

  assertDiscountVisibleWithActions = (name: string): void => {
    this.findRow(name).then((getRow) => {
      expect(getRow, 'discount row in list').to.not.equal(null);
      (getRow as TableRowGetter)().within(() => {
        cy.contains('Edit').should('exist');
        cy.contains('View').should('exist');
        cy.contains('Deactivate').should('exist');
      });
    });
  };

  openEditPageFromList = (name: string, idDiscount: number): void => {
    this.findRow(name).then((getRow) => {
      expect(getRow, 'discount row in list').to.not.equal(null);
      (getRow as TableRowGetter)().find(this.repository.getEditActionSelector()).should('exist').click({ force: true });
    });

    cy.url().should('include', this.editUrl(idDiscount));
    cy.get(this.repository.getHeadingSelector()).should('contain', this.repository.getEditHeading());
  };

  openViewPageFromList = (name: string, idDiscount: number): void => {
    this.findRow(name).then((getRow) => {
      expect(getRow, 'discount row in list').to.not.equal(null);
      (getRow as TableRowGetter)().find(this.repository.getViewActionSelector()).should('exist').click({ force: true });
    });

    cy.url().should('include', this.viewUrl(idDiscount));
    cy.get(this.repository.getHeadingSelector()).should('contain', this.repository.getViewHeading());
    cy.contains(name).should('be.visible');
  };

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
    cy.visitBackoffice(this.LIST_PAGE_URL);

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
