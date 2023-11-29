import { MultiCartRepository } from "./multi.cart.repository";
import { Page } from "../shared/page";
import { faker } from "@faker-js/faker";

export class MultiCartPage extends Page {
    PAGE_URL = '/multi-cart';
    repository: MultiCartRepository;

    constructor() {
        super();
        this.repository = new MultiCartRepository();
    }

    createCart = (name?: string) => {
        cy.visit(`${this.PAGE_URL}/create`);
        this.repository.getCreateCartNameInput().clear().type(name ?? `Cart #${faker.string.uuid()}`);
        this.repository.getCreateCartForm().submit();
    };
}
