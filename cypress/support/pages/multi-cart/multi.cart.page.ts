import {MultiCartRepository} from "./multi.cart.repository";
import {Page} from "../shared/page";
import {faker} from "@faker-js/faker";

export class MultiCartPage extends Page {
    PAGE_URL = '/multi-cart';
    repository: MultiCartRepository;

    constructor() {
        super();
        this.repository = new MultiCartRepository();
    }

    createNewCart = () => {
        cy.visit('/multi-cart/create');
        this.repository.getCreateCartNameInput().clear().type(`Cart #${faker.string.uuid()}`);
        this.repository.getCreateCartForm().submit();
    };
}
