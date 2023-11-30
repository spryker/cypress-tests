import { ShipmentRepository } from "./shipment.repository";
import { Page } from "../../../page";

export class ShipmentPage extends Page {
  PAGE_URL = "/checkout/shipment";
  repository: ShipmentRepository;

  constructor() {
    super();
    this.repository = new ShipmentRepository();
  }

  setStandardShippingMethod = () => {
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
