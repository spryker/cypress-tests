import {autoWired, REPOSITORIES} from '@utils';
import {inject, injectable} from 'inversify';
import { YvesPage } from '@pages/yves';
import 'cypress-file-upload';
import {ClaimRepository} from "./claim-repository";

@injectable()
@autoWired
export class ClaimDetailPage extends YvesPage {
    @inject(REPOSITORIES.ClaimRepository) private repository: ClaimRepository;

    public PAGE_URL = '/customer/claim/detail';

    assertOrderClaimDetails = (params: OrderClaimDetails): void => {
        this.assertClaimDetails(params);

    }

    assertClaimDetails = (params: ClaimDetails): void => {
        cy.contains(this.repository.getClaimDetailsReference(params.reference)).should('exist')
        cy.contains(this.repository.getClaimDetailsDate(params.date)).should('exist')
        cy.contains(new RegExp(this.repository.getClaimDetailsStatus(params.status), 'i')).should('exist');
        cy.contains(new RegExp(this.repository.getClaimDetailsType(params.type), 'i')).should('exist');
        cy.contains(this.repository.getClaimDetailsSubject(params.subject)).should('exist')
        cy.contains(this.repository.getClaimDetailsDescription(params.description)).should('exist')
        cy.contains(this.repository.getClaimDetailsCustomerFirstName(params.customer.firstName)).should('exist')
        cy.contains(this.repository.getClaimDetailsCustomerLastName(params.customer.lastName)).should('exist')
        cy.contains(this.repository.getClaimDetailsCustomerEmail(params.customer.email)).should('exist')
        cy.contains(this.repository.getClaimDetailsCompanyAndBusinessUnitName(params.customer.companyName, params.customer.businessUnitName)).should('exist')

        const getColumnIndexByName = (columnName: string): number => {
            const columnNames = ['File name', 'Size', 'Type', 'Actions'];
            return columnNames.indexOf(columnName);
        };

        const extractFileName = (filePath: string): string => {
            return filePath.split('/').pop() || '';
        };

        for (const file of params.files) {
            cy.get('tr').contains('td', extractFileName(file.name)).parent().within(() => {
                cy.get('td').eq(getColumnIndexByName('File name')).should('contain.text', extractFileName(file.name));
                cy.get('td').eq(getColumnIndexByName('Size')).should('contain.text', file.size);
                cy.get('td').eq(getColumnIndexByName('Type')).should('contain.text', file.extension);
                cy.get('td').eq(getColumnIndexByName('Actions')).should('contain.text', 'Download');
            });
        }
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
    companyName: string;
    businessUnitName: string;
}

export interface File {
    name: string;
    size: string;
    extension: string;
}

export interface OrderClaimDetails extends ClaimDetails {
    orderReference: string;
}
