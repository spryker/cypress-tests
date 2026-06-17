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
    this.repository.getCadenceTypeSelect().select(cadenceType);
  };

  confirmRecurringOrder = (): void => {
    this.repository.getConfirmButton().click();
    this.repository.getConfirmButton().click();
    this.repository.getConfirmButton().should('not.exist');
  };
}
