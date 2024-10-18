import { injectable } from 'inversify';
import {CmsRepository} from "../cms-repository";

@injectable()
export class SuiteCmsRepository implements CmsRepository {
    getFeaturedProductsBlockTitle = (): string => 'Featured Products';
    getProductSelector = (): Cypress.Chainable => cy.get('.product-item');
}
