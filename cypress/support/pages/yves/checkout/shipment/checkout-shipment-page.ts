import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CheckoutShipmentRepository } from './checkout-shipment-repository';

@injectable()
@autoWired
export class CheckoutShipmentPage extends YvesPage {
  @inject(REPOSITORIES.CheckoutShipmentRepository) private repository: CheckoutShipmentRepository;

  protected PAGE_URL = '/checkout/shipment';

  setStandardShippingMethod = (): void => {
    this.repository.getMultiShipmentGroups().each(($shipmentItem, index) => {
      this.repository.getStandardShipmentRadio($shipmentItem, index).click({ force: true });
    });

    this.repository
      .getShipmentDateInput()
      .clear()
      .type(new Date(+new Date().setHours(0, 0, 0, 0) + 86400000).toLocaleDateString('fr-CA'));
    this.repository.getNextButton().click();
  };
}
