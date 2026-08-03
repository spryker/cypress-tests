import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CheckoutSummaryRecurringOrderRepository } from './checkout-summary-recurring-order-repository';

@injectable()
@autoWired
export class CheckoutSummaryRecurringOrderPage extends YvesPage {
  @inject(REPOSITORIES.YvesCheckoutSummaryRecurringOrderRepository)
  private repository: CheckoutSummaryRecurringOrderRepository;

  protected PAGE_URL = '/checkout/summary';

  getRecurringOrderToggle = (): Cypress.Chainable => this.repository.getRecurringOrderToggle();

  getCadenceTypeSelect = (): Cypress.Chainable => this.repository.getCadenceTypeSelect();

  getConfirmButton = (): Cypress.Chainable => this.repository.getConfirmButton();

  enableRecurringOrder = (): void => {
    this.repository.getRecurringOrderToggle().click({ force: true });
  };

  fillScheduleName = (name: string): void => {
    this.repository.getScheduleNameInput().clear().type(name);
  };

  selectCadenceType = (cadenceType: string): void => {
    this.repository.getCadenceTypeSelect().select(cadenceType, { force: true });
  };

  confirmRecurringOrder = (): void => {
    cy.intercept('POST', '**/recurring-order/save').as('saveRequest');
    this.repository.getConfirmButton().click();
    cy.wait('@saveRequest');
    cy.get('body').then(($body) => {
      if ($body.find('[data-qa="recurring-order-confirm-button"]').length > 0) {
        cy.get('[data-qa="recurring-order-confirm-button"]').click();
        cy.wait('@saveRequest');
      }
    });
  };
}
