import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CheckoutSummaryBudgetRepository } from './checkout-summary-budget-repository';

@injectable()
@autoWired
export class CheckoutSummaryBudgetPage extends YvesPage {
  @inject(REPOSITORIES.YvesCheckoutSummaryBudgetRepository)
  private repository: CheckoutSummaryBudgetRepository;

  protected PAGE_URL = '/checkout/summary';

  getCheckoutErrorMessage = (): Cypress.Chainable => this.repository.getCheckoutErrorMessage();

  getWarnFlashMessage = (): Cypress.Chainable => this.repository.getWarnFlashMessage();

  approveQuote = (): void => {
    this.repository.getApproveButton().click();
  };

  declineQuote = (): void => {
    this.repository.getDeclineButton().click();
  };
}
