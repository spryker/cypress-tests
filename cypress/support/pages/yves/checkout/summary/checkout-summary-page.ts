import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '../../yves-page';
import { CheckoutSummaryRepository } from './checkout-summary-repository';

@injectable()
@autoWired
export class CheckoutSummaryPage extends YvesPage {
  @inject(REPOSITORIES.CheckoutSummaryRepository) private repository: CheckoutSummaryRepository;

  protected PAGE_URL = '/checkout/summary';

  placeOrder = (): void => {
    this.repository.getaAcceptTermsAndConditionsCheckbox().check({ force: true });
    this.repository.getSummaryForm().submit();
  };
}
