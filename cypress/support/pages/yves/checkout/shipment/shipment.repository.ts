export class ShipmentRepository {
  getMultiShipmentItemElement = () => {
    return cy.get('.form__fields.grid.grid--bottom');
  };

  getStandardShipmentRadio = (
    $shipmentItem: JQuery<HTMLElement>,
    index: number
  ) => {
    return cy
      .wrap($shipmentItem)
      .get(
        `#shipmentCollectionForm_shipmentGroups_${index}_shipment_shipmentSelection_0`
      );
  };

  getNextButton = () => {
    return cy.contains('button', 'Next');
  };
}
