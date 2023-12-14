import { AbstractPage } from '../../../abstract-page';
import { Repository } from './repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/types';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/auto-provide';

@injectable()
@autoProvide
export class Page extends AbstractPage {
  PAGE_URL = '/checkout/shipment';
  repository: Repository;

  constructor(
    @inject(TYPES.CheckoutShipmentRepository) repository: Repository
  ) {
    super();
    this.repository = repository;
  }

  setStandardShippingMethod = (): void => {
    this.repository
      .getMultiShipmentItemElement()
      .children()
      .filter(':contains("Spryker Dummy Shipment")')
      .each(($shipmentItem, index) => {
        this.repository
          .getStandardShipmentRadio($shipmentItem, index)
          .click({ force: true });
      });

    this.repository.getNextButton().click();
  };
}
