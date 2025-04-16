import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SspAssetAddRepository } from './ssp-asset-add-repository';
import 'cypress-file-upload';

@injectable()
@autoWired
export class SspAssetAddPage extends BackofficePage {
  @inject(SspAssetAddRepository) private repository: SspAssetAddRepository;

  protected PAGE_URL = '/ssp-asset-management/add';

  fillAssetForm(assetData: SspAsset): void {
    this.repository.getNameInput().type(assetData.name);

    if (assetData.serialNumber) {
      this.repository.getSerialNumberInput().type(assetData.serialNumber);
    }

    if (assetData.status) {
      this.repository.getStatusSelect().select(assetData.status);
    }

    if (assetData.note) {
      this.repository.getNoteTextarea().type(assetData.note);
    }

    if (assetData.image) {
      this.repository.getImageUploadInput().attachFile(assetData.image);
    }

    if (assetData.businessUnitOwner) {
      cy.intercept('GET', '**/company-business-unit-gui/suggest*').as('businessUnitOwnerSuggest');

      this.repository.getBusinessUnitOwnerSelect().next('.select2').find('.select2-selection').click();

      this.repository
        .getSelectContainerContainer()
        .find(this.repository.getSearchFieldSelector())
        .type(assetData.businessUnitOwner.name, { force: true });

      cy.wait('@businessUnitOwnerSuggest');

      this.repository.getDropdownOptionContainer().filter(':visible').first().click();
    }

    if (assetData.company) {
      cy.intercept('GET', '**/company-gui/suggest*').as('companySuggest');

      this.repository.getAssignedCompaniesSelect().next('.select2').find('.select2-selection').click();

      this.repository
        .getSelectContainerContainer()
        .find(this.repository.getSearchFieldSelector())
        .type(assetData.company.name, { force: true });

      cy.wait('@companySuggest');

      this.repository.getDropdownOptionContainer().filter(':visible').first().click();
    }

    for (const businessUnit of assetData.assignedbusinessUnits || []) {
      cy.intercept('GET', '**/company-business-unit-gui/suggest*').as('businessUnitSuggest');

      this.repository.getAssignedBusinessUnitsSelect().siblings('span').click();

      this.repository
        .getSelectContainerContainer()
        .find(this.repository.getSearchFieldSelector())
        .type(businessUnit.name, { force: true });

      cy.wait('@businessUnitSuggest');

      this.repository.getDropdownOptionContainer().filter(':visible').first().click();
    }
  }

  submitForm(): void {
    this.repository.getSubmitButton().click();
  }

  verifySuccessMessage(): void {
    this.repository.getSuccessMessageContainer().should('contain', this.repository.getSuccessMessage());
  }
}

interface SspAsset {
  name: string;
  serialNumber?: string;
  status?: string;
  note?: string;
  image?: string;
  businessUnitOwner?: BusinessOwner;
  assignedbusinessUnits?: BusinessOwner[];
  company?: Company;
}

interface Company {
  name: string;
}

interface BusinessOwner {
  name: string;
}
