import { injectable } from 'inversify';
import { SspAssetRepository } from '../ssp-asset-repository';

@injectable()
export class SuiteSspAssetRepository implements SspAssetRepository {
    getCreateAssetButton(): Cypress.Chainable {
        return cy.get('[data-qa="create-asset-button"]');
    }

    getAssetForm(): Cypress.Chainable {
        return cy.get('[data-qa="customer-create-asset-form"]');
    }

    getNameInput(): Cypress.Chainable {
        return cy.get('#assetForm_name');
    }

    getSubmitButton(): Cypress.Chainable {
        return cy.get('[data-qa="submit-button"]');
    }

    getAssetCreatedMessage(): string {
        return 'Asset has been successfully created';
    }
}
