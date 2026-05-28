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

  assertEnforcementError = (): void => {
    this.repository.getCheckoutErrorMessage().should('be.visible');
  };

  assertWarnFlashMessage = (): void => {
    this.repository.getWarnFlashMessage().should('be.visible');
  };

  assertLockedCostCenterValue = (): void => {
    this.repository.getCostCenterSelectorValue().should('be.visible');
  };

  assertBudgetRemainingVisible = (): void => {
    this.repository.getBudgetRemainingAmount().should('be.visible');
  };

  assertApproveButtonVisible = (): void => {
    this.repository.getApproveButton().should('be.visible');
  };

  assertDeclineButtonVisible = (): void => {
    this.repository.getDeclineButton().should('be.visible');
  };

  approveQuote = (): void => {
    this.repository.getApproveButton().click();
  };

  declineQuote = (): void => {
    this.repository.getDeclineButton().click();
  };
}
