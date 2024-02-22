import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/inversify/types';
import 'reflect-metadata';
import { CheckoutShipmentRepository } from './checkout-shipment-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class CheckoutShipmentPage extends AbstractPage {
  public PAGE_URL: string = '/checkout/shipment';

  constructor(@inject(TYPES.YvesCheckoutShipmentRepository) private repository: CheckoutShipmentRepository) {
    super();
  }

  public setStandardShippingMethod = (): void => {
    this.repository
      .getMultiShipmentItemElement()
      .children()
      .filter(':contains("Spryker Dummy Shipment")')
      .each(($shipmentItem, index) => {
        this.repository.getStandardShipmentRadio($shipmentItem, index).click({ force: true });
      });

    this.repository.getNextButton().click();
  };
}
