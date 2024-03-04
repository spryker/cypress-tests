import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/inversify/types';
import 'reflect-metadata';
import { CheckoutShipmentRepository } from './checkout-shipment-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { YvesPage } from '../../yves-page';

@injectable()
@autoWired
export class CheckoutShipmentPage extends YvesPage {
  protected PAGE_URL: string = '/checkout/shipment';

  constructor(@inject(TYPES.CheckoutShipmentRepository) private repository: CheckoutShipmentRepository) {
    super();
  }

  public setStandardShippingMethod = (): void => {
    this.repository.getMultiShipmentGroups().each(($shipmentItem, index) => {
      this.repository.getStandardShipmentRadio($shipmentItem, index).click({ force: true });
    });

    this.repository.getNextButton().click();
  };
}
