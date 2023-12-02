import { AbstractPage } from '../../../abstract-page';
import { Repository } from './repository';

export class Page extends AbstractPage {
  PAGE_URL = '/checkout/shipment';
  repository: Repository;

  constructor() {
    super();
    this.repository = new Repository();
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
