import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/inversify/types';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import { YvesCheckoutSummaryRepository } from './yves-checkout-summary-repository';

@injectable()
@autoProvide
export class YvesCheckoutSummaryPage extends AbstractPage {
  public PAGE_URL: string = '/checkout/summary';

  constructor(@inject(TYPES.YvesCheckoutSummaryRepository) private repository: YvesCheckoutSummaryRepository) {
    super();
  }

  public placeOrder = (): void => {
    this.repository.getaAcceptTermsAndConditionsCheckbox().check({ force: true });
    this.repository.getSummaryForm().submit();
  };
}
