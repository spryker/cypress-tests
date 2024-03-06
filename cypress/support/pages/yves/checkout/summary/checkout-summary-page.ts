import { TYPES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { YvesPage } from '../../yves-page';
import { CheckoutSummaryRepository } from './checkout-summary-repository';

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
