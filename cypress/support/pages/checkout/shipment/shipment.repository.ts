export class ShipmentRepository {
    getStandardShipmentRadio = () => {
        return cy.get('#shipmentCollectionForm_shipmentGroups_0_shipment_shipmentSelection_0');
    }

    getNextButton = () => {
        return cy.contains('button', 'Next');
    }
}
