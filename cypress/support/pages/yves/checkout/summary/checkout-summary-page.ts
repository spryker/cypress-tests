import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/inversify/types';
import 'reflect-metadata';
import { CheckoutSummaryRepository } from './checkout-summary-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { YvesPage } from '../../yves-page';

@injectable()
@autoWired
export class CheckoutSummaryPage extends YvesPage {
  protected PAGE_URL: string = '/checkout/summary';

  constructor(@inject(TYPES.CheckoutSummaryRepository) private repository: CheckoutSummaryRepository) {
    super();
  }

  public placeOrder = (): void => {
    this.repository.getaAcceptTermsAndConditionsCheckbox().check({ force: true });
    this.repository.getSummaryForm().submit();
  };
}
