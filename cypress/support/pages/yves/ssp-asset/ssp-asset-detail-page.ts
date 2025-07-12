import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { SspAssetRepository } from './ssp-asset-repository';

@injectable()
@autoWired
export class SspAssetDetailPage extends YvesPage {
  @inject(REPOSITORIES.SspAssetRepository) private repository: SspAssetRepository;

  public PAGE_URL = '/customer/ssp-asset/details';

  assertAssetDetails(details: SspAssetDetails): void {
    if (details.reference) {
      cy.contains(details.reference).should('exist');
    }

    if (details.name) {
      this.repository.getAssetDetailsTitle().should('contain', details.name);
    }

    if (details.serialNumber) {
      cy.contains(this.repository.getAssetDetailsSerialNumber(details.serialNumber)).should('exist');
    }

    if (details.note) {
      cy.contains(this.repository.getAssetDetailsNote(details.note)).should('exist');
    }

    if (details.image) {
      this.repository.getSspAssetImageSrc().should('include', 'customer/ssp-asset/view-image?ssp-asset-reference=');
    } else {
      this.repository.getSspAssetImageSrc().should('not.include', 'customer/ssp-asset/view-image?ssp-asset-reference=');
    }
  }

  assertSspInquiries(sspInquiries: SspInquiry[]): void {
    this.getSspAssetInquiriresTable().should('exist');
    this.getSspAssetInquiriresTable().find('tbody tr').its('length').should('eq', sspInquiries.length);

    sspInquiries.forEach((sspInquiry) => {
      this.getSspAssetInquiriresTable().should('contain', sspInquiry.reference);
    });
  }

  assertSspServices(sspServices: SspService[]): void {
    this.repository.getSspAssetServicesTable().should('exist');
    this.repository.getSspAssetServicesTable().find('tbody tr').its('length').should('eq', sspServices.length);

    sspServices.forEach((sspServices) => {
      this.repository.getSspAssetServicesTable().should('contain', sspServices.name);
      this.repository.getSspAssetServicesTable().should('contain', sspServices.customerFirstName);
      this.repository.getSspAssetServicesTable().should('contain', sspServices.customerLastName);
      this.repository.getSspAssetServicesTable().should('contain', sspServices.companyName);
    });
  }

  getViewAllInquiriesLink(): Cypress.Chainable {
    return this.repository.getViewAllInquiriesLink();
  }

  assertSspAssetAssignments(assignedBusinessUnits: BusinessUnit[]): void {
    this.getSspAssetAssignments().its('length').should('eq', assignedBusinessUnits.length);

    assignedBusinessUnits.forEach((assignedBusinessUnit) => {
      this.getSspAssetAssignments().should('contain', assignedBusinessUnit.name);
    });
  }

  getEditButton(): Cypress.Chainable {
    return this.repository.getEditAssetButton();
  }

  getUnassignButton(): Cypress.Chainable {
    return this.repository.getUnassignButton();
  }

  getUnassignLink(): Cypress.Chainable {
    return this.repository.getUnassignLink();
  }

  clickCreateClaimButton(): void {
    this.repository.getCreateInquiryButton().click();
  }

  getUnassignmentErrorMessage(): string {
    return this.repository.getUnassignmentErrorMessage();
  }

  getSspAssetAssignments(): Cypress.Chainable {
    return this.repository.getSspAssetAssignments();
  }

  getSspAssetServicesButton(): Cypress.Chainable {
    return this.repository.getSspAssetServicesButton();
  }

  getSspAssetInquiriresTable(): Cypress.Chainable {
    return this.repository.getSspAssetInquiriresTable();
  }
}

interface SspAssetDetails {
  reference?: string;
  name: string;
  serialNumber?: string;
  note?: string;
  image?: string;
  businessUnitOwner?: BusinessUnit;
  businessUnitAssignment?: BusinessUnit[];
}

interface SspInquiry {
  reference: string;
}

interface BusinessUnit {
  name: string;
}

interface SspService {
  name: string;
  customerFirstName: string;
  customerLastName: string;
  companyName: string;
}
