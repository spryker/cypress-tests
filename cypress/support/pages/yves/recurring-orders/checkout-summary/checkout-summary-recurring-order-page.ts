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

  assertRecurringOrderToggleVisible = (): void => {
    this.repository.getRecurringOrderToggle().should('be.visible');
  };

  assertRecurringOrderToggleNotVisible = (): void => {
    this.repository.getRecurringOrderToggle().should('not.exist');
  };

  enableRecurringOrder = (): void => {
    this.repository.getRecurringOrderToggle().click({ force: true });
    this.repository.getCadenceTypeSelect().should('be.visible');
  };

  fillScheduleName = (name: string): void => {
    this.repository.getScheduleNameInput().clear().type(name);
  };

  selectCadenceType = (cadenceType: string): void => {
    this.repository.getCadenceTypeSelect().select(cadenceType, { force: true });
  };

  assertStartDateEarliestIsToday = (today: string): void => {
    this.repository.getStartDateInput().should('have.attr', 'min', today);
  };

  assertStartDateRejectsPastDate = (pastDate: string): void => {
    this.repository.getStartDateInput().clear().type(pastDate);
    this.repository.getStartDateInput().should(($input): void => {
      expect(($input[0] as HTMLInputElement).validity.rangeUnderflow).to.eq(true);
    });
  };

  selectStartDate = (date: string): void => {
    this.repository.getStartDateInput().clear().type(date);
  };

  assertStartDateSelected = (date: string): void => {
    this.repository.getStartDateInput().should('have.value', date);
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
    this.repository.getConfirmButton().should('not.exist');
  };
}
