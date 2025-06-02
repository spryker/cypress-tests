import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SspAssetDetailRepository } from './ssp-asset-detail-repository';

@injectable()
@autoWired
export class SspAssetDetailPage extends BackofficePage {
  @inject(SspAssetDetailRepository) private repository: SspAssetDetailRepository;

  protected PAGE_URL = '/ssp-asset-management/detail';

  verifyAssetDetails(assetData: SspAsset): void {
    this.repository
      .getSspAssetRelationTabs()
      .find(this.repository.getCompaniesTabClickSelector())
      .click({ force: true });
    if (assetData.reference) {
      cy.get(this.repository.getReferenceValueSelector()).should('contain', assetData.reference);
    }

    if (assetData.name) {
      cy.get(this.repository.getNameValueSelector()).should('contain', assetData.name);
    }

    if (assetData.serialNumber) {
      cy.get(this.repository.getSerialNumberValueSelector()).should('contain', assetData.serialNumber);
    }

    if (assetData.status) {
      const expectedStatus = assetData.status.toLowerCase();
      cy.get(this.repository.getStatusValueSelector()).then(($statusElement) => {
        const actualStatus = $statusElement.text().trim().toLowerCase();
        expect(actualStatus).to.include(expectedStatus);
      });
    }

    if (assetData.note) {
      cy.get(this.repository.getNoteValueSelector()).should('contain', assetData.note);
    }

    if (assetData.image) {
      cy.get(this.repository.getImageSelector()).should('exist');
    } else {
      cy.get(this.repository.getImageSelector()).should('not.exist');
    }

    this.repository.getSspAssetRelationTabs().find(this.repository.getCompaniesTabSelector()).should('exist');
    this.repository.getSspAssetRelationTabs().find(this.repository.getInquiriesTabSelector()).should('exist');

    if (assetData.companies) {
      for (const company of assetData.companies) {
        this.repository.getCompaniesTabContent().contains(company.name).should('be.visible');
      }
    }

    if (assetData.assignedbusinessUnits && assetData.assignedbusinessUnits.length > 0) {
      this.repository
        .getSspAssetRelationTabs()
        .find(this.repository.getCompanyTableSelector())
        .should('be.visible')
        .find('tbody tr')
        .should('have.length.at.least', assetData.assignedbusinessUnits.length);

      for (const businessUnit of assetData.assignedbusinessUnits) {
        this.repository.getCompaniesTabContent().contains(businessUnit.name).should('be.visible');
      }
    }

    if (assetData.businessUnitOwner) {
      cy.get(this.repository.getBusinessUnitOwnerValueSelector()).should('contain', assetData.businessUnitOwner.name);
    }

    this.repository.getSspAssetRelationTabs().find(this.repository.getServicesTabSelector()).should('exist');

    if (assetData.orderReference) {
      this.repository.getSspAssetRelationTabs().find(this.repository.getServicesTabSelector()).click();
      cy.get(this.repository.getOrderReferenceColumnSelector()).contains(assetData.orderReference).should('be.visible');
    }
  }

  verifyImageIsVisible(): void {
    cy.get(this.repository.getImageSelector()).should('be.visible');
  }

  clickEditButton(): void {
    cy.get(this.repository.getEditButtonSelector()).click();
  }

  clickBackButton(): void {
    cy.get(this.repository.getBackButtonSelector()).click();
  }

  /**
   * Gets the asset ID from the current URL
   * @returns Cypress.Chainable with the asset ID as a number
   */
  getAssetId(): Cypress.Chainable<number> {
    return cy.url().then((url) => {
      const urlParams = new URLSearchParams(new URL(url).search);
      const idSspAsset = urlParams.get('id-ssp-asset');

      if (idSspAsset) {
        return parseInt(idSspAsset, 10);
      }

      throw new Error('Asset ID not found in URL');
    });
  }

  getReference(): Cypress.Chainable<string> {
    return cy
      .get(this.repository.getReferenceValueSelector())
      .invoke('text')
      .then((text) => text.trim());
  }
}

interface SspAsset {
  reference: string;
  name: string;
  serialNumber?: string;
  status?: string;
  note?: string;
  image?: string;
  businessUnitOwner?: BusinessOwner;
  assignedbusinessUnits?: BusinessOwner[];
  companies: Company[];
  orderReference?: string;
}

interface Company {
  name: string;
}

interface BusinessOwner {
  name: string;
}
