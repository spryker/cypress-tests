import { AbstractPage } from '../../../abstract-page';
import { Repository } from './repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/types';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/auto-provide';

@injectable()
@autoProvide
export class Page extends AbstractPage {
  PAGE_URL = '/checkout/summary';
  repository: Repository;

  constructor(@inject(TYPES.CheckoutSummaryRepository) repository: Repository) {
    super();
    this.repository = repository;
  }

  placeOrder = (): void => {
    this.repository
      .getaAcceptTermsAndConditionsCheckbox()
      .check({ force: true });
    this.repository.getSummaryForm().submit();
  };
}
