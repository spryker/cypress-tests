import { TYPES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { YvesPage } from '../../yves-page';
import { CheckoutShipmentRepository } from './checkout-shipment-repository';

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
