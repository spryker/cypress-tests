import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SspAssetUpdateRepository } from './ssp-asset-update-repository';

@injectable()
@autoWired
export class SspAssetUpdatePage extends BackofficePage {
  @inject(SspAssetUpdateRepository) private repository: SspAssetUpdateRepository;

  protected PAGE_URL = '/self-service-portal/update-asset';

  updateAssetForm(assetData: SspAsset): void {
    if (assetData.name) {
      cy.get(this.repository.getNameInputSelector()).clear();
      cy.get(this.repository.getNameInputSelector()).type(assetData.name);
    }

    if (assetData.serialNumber) {
      cy.get(this.repository.getSerialNumberInputSelector()).clear();
      cy.get(this.repository.getSerialNumberInputSelector()).type(assetData.serialNumber);
    }

    if (assetData.status) {
      cy.get(this.repository.getStatusSelectSelector()).select(assetData.status);
    }

    if (assetData.note) {
      cy.get(this.repository.getNoteTextareaSelector()).clear();
      cy.get(this.repository.getNoteTextareaSelector()).type(assetData.note);
    }

    if (!assetData.image) {
      cy.get(this.repository.getImageDeleteSelector()).check({ force: true });
    }

    if (assetData.businessUnitOwner) {
      this.updateBusinessUnitOwner(assetData.businessUnitOwner);
    }

    if (assetData.companies && assetData.companies.length > 0) {
      this.updateAssignedCompanies(assetData.companies);
    }

    if (assetData.assignedbusinessUnits && assetData.assignedbusinessUnits.length > 0) {
      this.updateAssignedBusinessUnits(assetData.assignedbusinessUnits);
    }
  }

  uploadImage(imagePath: string): void {
    cy.get(this.repository.getImageUploadSelector()).attachFile(imagePath);
  }

  submitForm(): void {
    cy.get(this.repository.getSubmitButtonSelector()).click();
  }

  verifySuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector()).should('contain', this.repository.getSuccessMessage());
  }

  updateBusinessUnitOwner(businessUnitOwner: BusinessUnit): void {
    cy.get(this.repository.getBusinessUnitOwnerSelect()).select('', { force: true });

    cy.intercept('GET', '**/company-business-unit-gui/suggest*').as('businessUnitOwnerSuggest');

    cy.get(this.repository.getBusinessUnitOwnerSelect()).next(this.repository.getSelectContainer()).click();

    cy.get(this.repository.getSelectContainerSelector())
      .find(this.repository.getSearchFieldSelector())
      .type(businessUnitOwner.name, { force: true });

    cy.wait('@businessUnitOwnerSuggest');

    cy.get(this.repository.getDropdownOptionSelector()).filter(':visible').first().click();
  }

  updateAssignedCompanies(companies: Company[]): void {
    this.repository
      .getAssignedCompaniesSelect()
      .next(this.repository.getSelectContainer())
      .find(this.repository.getSelectionChoiceRemoveSelector())
      .each(($el) => {
        cy.wrap($el).click();
      });

    this.repository.getAssignedCompaniesSelect().next(this.repository.getSelectContainer()).click();

    for (const company of companies) {
      cy.intercept('GET', '**/company-gui/suggest*').as('companySuggest');

      this.repository.getAssignedCompaniesSelect().next(this.repository.getSelectContainer()).click();

      cy.get(this.repository.getSelectContainerSelector())
        .find(this.repository.getSearchFieldSelector())
        .type(company.name, { force: true });

      cy.wait('@companySuggest');

      cy.get(this.repository.getDropdownOptionSelector()).filter(':visible').first().click();
    }
  }

  updateAssignedBusinessUnits(businessUnits: BusinessUnit[]): void {
    cy.get(this.repository.getAssignedBusinessUnitsSelector())
      .next(this.repository.getSelectContainer())
      .find(this.repository.getSelectionChoiceSelector())
      .then(($choices) => {
        const count = $choices.length;
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            cy.get(this.repository.getAssignedBusinessUnitsSelector())
              .next(this.repository.getSelectContainer())
              .find(this.repository.getSelectionChoiceRemoveSelector())
              .first()
              .click({ force: true });
          }
        }
      });

    cy.get(this.repository.getAssignedBusinessUnitsSelector()).next(this.repository.getSelectContainer()).click();

    for (const businessUnit of businessUnits) {
      cy.intercept('GET', '**/company-business-unit-gui/suggest*').as('businessUnitSuggest');

      cy.get(this.repository.getAssignedBusinessUnitsSelector()).next(this.repository.getSelectContainer()).click();

      cy.get(this.repository.getSelectContainerSelector())
        .find(this.repository.getSearchFieldSelector())
        .type(businessUnit.name, { force: true });

      cy.wait('@businessUnitSuggest');

      cy.get(this.repository.getDropdownOptionSelector()).filter(':visible').first().click();
    }
  }
}

interface SspAsset {
  name: string;
  serialNumber?: string;
  status?: string;
  note?: string;
  image?: string;
  businessUnitOwner?: BusinessUnit;
  assignedbusinessUnits?: BusinessUnit[];
  companies: Company[];
}

interface Company {
  name: string;
}

interface BusinessUnit {
  name: string;
}
