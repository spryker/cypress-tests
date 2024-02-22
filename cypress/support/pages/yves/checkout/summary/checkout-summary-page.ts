import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/inversify/types';
import 'reflect-metadata';
import { CheckoutSummaryRepository } from './checkout-summary-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class CheckoutSummaryPage extends AbstractPage {
  public PAGE_URL: string = '/checkout/summary';

  constructor(@inject(TYPES.YvesCheckoutSummaryRepository) private repository: CheckoutSummaryRepository) {
    super();
  }

  public placeOrder = (): void => {
    this.repository.getaAcceptTermsAndConditionsCheckbox().check({ force: true });
    this.repository.getSummaryForm().submit();
  };
}
