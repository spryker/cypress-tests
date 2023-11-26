import {ShipmentRepository} from "./shipment.repository";
import {Page} from "../../shared/page";

export class ShipmentPage extends Page
{
    PAGE_URL = '/checkout/shipment';
    repository: ShipmentRepository;

    constructor()
    {
        super();
        this.repository = new ShipmentRepository();
    }

    setStandardShippingMethod = () => {
        this.repository.getStandardShipmentRadio().click({force: true});
        this.repository.getNextButton().click();
    };
}
