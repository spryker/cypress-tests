import { AbstractPage } from '../../../abstract-page';
import { Repository } from './repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/inversify/types';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class Page extends AbstractPage {
  PAGE_URL: string = '/checkout/payment';
  repository: Repository;

  constructor(@inject(TYPES.CheckoutPaymentRepository) repository: Repository) {
    super();
    this.repository = repository;
  }

  setDummyPaymentMethod = (): void => {
    this.repository.getDummyPaymentInvoiceRadio().click({ force: true });
    this.repository
      .getDummyPaymentInvoiceDateField()
      .clear()
      .type('12.12.1999');

    this.repository.getGoToSummaryButton().click();
  };
}
