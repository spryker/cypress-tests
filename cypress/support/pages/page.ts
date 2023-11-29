import { Faker, faker } from "@faker-js/faker";

export class Page {
    PAGE_URL = '';
    protected faker: Faker;

    constructor() {
        this.faker = faker;
    }

    assertPageLocation = () => {
        cy.url().should('include', this.PAGE_URL);
    }
}
