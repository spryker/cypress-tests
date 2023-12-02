import { AbstractPage } from '../../../abstract-page';
import { Repository } from './repository';

export class Page extends AbstractPage {
  PAGE_URL = '/checkout/summary';
  repository: Repository;

  constructor() {
    super();
    this.repository = new Repository();
  }

  placeOrder = (): void => {
    this.repository
      .getaAcceptTermsAndConditionsCheckbox()
      .check({ force: true });
    this.repository.getSummaryForm().submit();
  };
}
