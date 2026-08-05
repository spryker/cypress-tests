import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { SspAssetRepository } from './ssp-asset-repository';

@injectable()
@autoWired
export class SspAssetDetailPage extends YvesPage {
  @inject(REPOSITORIES.SspAssetRepository) private repository: SspAssetRepository;

  public PAGE_URL = '/customer/ssp-asset/details';

  getReferenceContainer(reference: string): Cypress.Chainable {
    return cy.contains(reference);
  }

  getAssetTitle(): Cypress.Chainable {
    return this.repository.getAssetDetailsTitle();
  }

  getSerialNumberContainer(serialNumber: string): Cypress.Chainable {
    return cy.contains(this.repository.getAssetDetailsSerialNumber(serialNumber));
  }

  getNoteContainer(note: string): Cypress.Chainable {
    return cy.contains(this.repository.getAssetDetailsNote(note));
  }

  getImageSrc(): Cypress.Chainable {
    return this.repository.getSspAssetImageSrc();
  }

  getSspAssetServicesTable(): Cypress.Chainable {
    return this.repository.getSspAssetServicesTable();
  }

  getViewAllInquiriesLink(): Cypress.Chainable {
    return this.repository.getViewAllInquiriesLink();
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

  getSspAssetSparePartsButton(): Cypress.Chainable {
    return this.repository.getSspAssetSparePartsButton();
  }

  getSspAssetInquiriresTable(): Cypress.Chainable {
    return this.repository.getSspAssetInquiriresTable();
  }
}
