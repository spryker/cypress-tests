import { injectable } from 'inversify';
import { CompanyUserListRepository } from '../company-user-list-repository';

@injectable()
export class SuiteCompanyUserListRepository implements CompanyUserListRepository {
    getTopUserEnableButton = (): Cypress.Chainable =>
        cy.get('body').find('.user-table tr a:contains("Enable")');
    getTopUserDisableButton = (): Cypress.Chainable =>
        cy.get('body').find('.user-table tr a:contains("Disable")');
}
