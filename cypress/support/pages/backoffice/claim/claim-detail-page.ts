import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class ClaimDetailPage extends BackofficePage {
    protected PAGE_URL = '/claim/detail';

    assertClaimDetails = (params: ClaimDetails): void => {
        cy.get('dl').contains('dt', 'Claim reference').parent().within(() => {
            cy.get('dd').should('contain.text', params.reference);
        });

        cy.get('dl').contains('dt', 'Customer').parent().within(() => {
            cy.get('dd').should('contain.text', params.customer.salutation + ' ' + params.customer.firstName + ' ' + params.customer.lastName);
        });

        cy.get('dl').contains('dt', 'Date').parent().within(() => {
            cy.get('dd').should('contain.text', params.date);
        });

        cy.get('dl').contains('dt', 'Status').parent().within(() => {
            cy.get('dd').should('contain.text', params.status);
        });

        cy.get('dl').contains('dt', 'Company / Business Unit').parent().within(() => {
            cy.get('dd').should('contain.text', params.customer.companyName + ' / ' + params.customer.businessUnitName);
        });

    }
}


export interface ClaimDetails {
    reference: string;
    type: string;
    subject: string;
    description: string;
    date: string;
    status: string
    customer: Customer;
    files: File[];
}

export interface Customer {
    firstName: string;
    lastName: string;
    email: string;
    salutation: string;
    companyName: string;
    businessUnitName: string;
}

export interface File {
    name: string;
    sise: string;
    extension: string;
}
