import { Page } from "../../page";
import { SalesRepository } from "./sales.repository";

export class SalesPage extends Page {
    PAGE_URL = '/sales';
    repository: SalesRepository;

    constructor() {
        super();
        this.repository = new SalesRepository();
    }

    viewLastPlacedOrder = () => {
        cy.visitBackoffice(this.PAGE_URL);
        this.repository.getViewButtons().first().click();
    }
}
