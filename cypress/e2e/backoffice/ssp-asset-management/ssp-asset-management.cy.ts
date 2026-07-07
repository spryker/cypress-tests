import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SspAssetStaticFixtures, SspAssetDynamicFixtures } from '@interfaces/backoffice';
import {
  SspAssetListPage,
  SspAssetAddPage,
  SspAssetDetailPage,
  SspAssetUpdatePage,
  SspModelListPage,
} from '@pages/backoffice/';

import { SspAssetDetailPage as YvesSspAssetDetailPage } from '@pages/yves/';
import { CustomerLoginScenario } from '@scenarios/yves';

interface AssetDetailsData {
  reference?: string;
  name?: string;
  serialNumber?: string;
  status?: string;
  note?: string;
  image?: string;
  businessUnitOwner?: { name: string };
  assignedbusinessUnits?: { name: string }[];
  companies?: { name: string }[];
  orderReference?: string;
}

const verifyAssetDetails = (page: SspAssetDetailPage, assetData: AssetDetailsData): void => {
  page.openCompaniesTab();

  if (assetData.reference) {
    page.getReferenceValue().should('contain', assetData.reference);
  }

  if (assetData.name) {
    page.getNameValue().should('contain', assetData.name);
  }

  if (assetData.serialNumber) {
    page.getSerialNumberValue().should('contain', assetData.serialNumber);
  }

  if (assetData.status) {
    const expectedStatus = assetData.status.toLowerCase();
    page.getStatusValue().then(($statusElement) => {
      const actualStatus = $statusElement.text().trim().toLowerCase();
      expect(actualStatus).to.include(expectedStatus);
    });
  }

  if (assetData.note) {
    page.getNoteValue().should('contain', assetData.note);
  }

  if (assetData.image) {
    page.getImage().should('exist');
  } else {
    page.getImage().should('not.exist');
  }

  page.getCompaniesTab().should('exist');
  page.getInquiriesTab().should('exist');

  if (assetData.companies) {
    for (const company of assetData.companies) {
      page.getCompaniesTabContent().contains(company.name).should('be.visible');
    }
  }

  if (assetData.assignedbusinessUnits && assetData.assignedbusinessUnits.length > 0) {
    page
      .getCompanyTable()
      .should('be.visible')
      .find('tbody tr')
      .should('have.length.at.least', assetData.assignedbusinessUnits.length);

    for (const businessUnit of assetData.assignedbusinessUnits) {
      page.getCompaniesTabContent().contains(businessUnit.name).should('be.visible');
    }
  }

  if (assetData.businessUnitOwner) {
    page.getBusinessUnitOwnerValue().should('contain', assetData.businessUnitOwner.name);
  }

  page.getServicesTab().should('exist');

  if (assetData.orderReference) {
    page.openServicesTab();
    page.getOrderReferenceColumn().contains(assetData.orderReference).should('be.visible');
  }
};

const assertYvesAssetDetails = (page: YvesSspAssetDetailPage, details: AssetDetailsData): void => {
  if (details.reference) {
    page.getReferenceContainer(details.reference).should('exist');
  }

  if (details.name) {
    page.getAssetTitle().should('contain', details.name);
  }

  if (details.serialNumber) {
    page.getSerialNumberContainer(details.serialNumber).should('exist');
  }

  if (details.note) {
    page.getNoteContainer(details.note).should('exist');
  }

  if (details.image) {
    page.getImageSrc().should('include', 'customer/ssp-asset/view-image?ssp-asset-reference=');
  } else {
    page.getImageSrc().should('not.include', 'customer/ssp-asset/view-image?ssp-asset-reference=');
  }
};

describe(
  'ssp asset management',
  {
    tags: [
      '@backoffice',
      '@assetManagement',
      '@ssp',
      'ssp-asset-management',
      'self-service-portal',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  () => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }
    const userLoginScenario = container.get(UserLoginScenario);
    const assetManagementListPage = container.get(SspAssetListPage);
    const assetManagementAddPage = container.get(SspAssetAddPage);
    const assetManagementDetailPage = container.get(SspAssetDetailPage);
    const assetManagementUpdatePage = container.get(SspAssetUpdatePage);
    const sspModelListPage = container.get(SspModelListPage);
    const yvesSspAssetDetailPage = container.get(YvesSspAssetDetailPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let dynamicFixtures: SspAssetDynamicFixtures;
    let staticFixtures: SspAssetStaticFixtures;

    retryableBefore((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach(() => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should be able to create a new asset', () => {
      assetManagementListPage.visit();

      assetManagementListPage.getIdHeader().should('exist');
      assetManagementListPage.getReferenceHeader().should('exist');
      assetManagementListPage.getImageHeader().should('exist');
      assetManagementListPage.getNameHeader().should('exist');
      assetManagementListPage.getSerialNumberHeader().should('exist');
      assetManagementListPage.getStatusHeader().should('exist');

      assetManagementListPage.getIdColumnValues().then((ids) => {
        const sortedIds = [...ids].sort((a, b) => b - a);
        expect(ids).to.deep.equal(sortedIds, 'ID column should be sorted in descending order');
      });

      assetManagementListPage.clickCreateButton();

      assetManagementAddPage.fillAssetForm({
        name: staticFixtures.sspAsset.name,
        serialNumber: staticFixtures.sspAsset.serial_number,
        status: staticFixtures.sspAsset.status,
        note: staticFixtures.sspAsset.note,
        image: staticFixtures.sspAsset.image,
        businessUnitOwner: { name: dynamicFixtures.businessUnit1.name },
        assignedbusinessUnits: [
          { name: dynamicFixtures.businessUnit1.name },
          { name: dynamicFixtures.businessUnit2.name },
        ],
        company: { name: dynamicFixtures.company1.name },
      });
      assetManagementAddPage.checkCreateSspModelCheckbox();

      assetManagementAddPage.submitForm();
      assetManagementAddPage.getSuccessMessageContainer().should('contain', assetManagementAddPage.getSuccessMessage());

      assetManagementDetailPage.assertPageLocation();
      verifyAssetDetails(assetManagementDetailPage, {
        reference: staticFixtures.sspAsset.reference,
        name: staticFixtures.sspAsset.name,
        status: staticFixtures.sspAsset.status,
        note: staticFixtures.sspAsset.note,
        serialNumber: staticFixtures.sspAsset.serial_number,
        image: staticFixtures.sspAsset.image,
        businessUnitOwner: { name: dynamicFixtures.businessUnit1.name },
        assignedbusinessUnits: [
          { name: dynamicFixtures.businessUnit1.name },
          { name: dynamicFixtures.businessUnit2.name },
        ],
        companies: [{ name: dynamicFixtures.company1.name }],
      });

      assetManagementDetailPage.getReference().then((reference) => {
        const assetReference = reference;

        assetManagementListPage.visit();

        assetManagementListPage.searchAsset(reference);

        cy.intercept('GET', '**/self-service-portal/list-asset/table*').as('assetTableData');

        cy.wait('@assetTableData').then(() => {
          let displayStatus = staticFixtures.sspAsset.status;

          if (Array.isArray(staticFixtures.statuses)) {
            const matchingStatus = staticFixtures.statuses.find(
              (statusObj) => statusObj.key === staticFixtures.sspAsset.status
            );

            if (matchingStatus && matchingStatus.value) {
              displayStatus = matchingStatus.value;
            }
          }

          assetManagementListPage
            .getTableRows()
            .should('contain', assetReference)
            .and('contain', staticFixtures.sspAsset.name)
            .and('contain', displayStatus)
            .and('contain', staticFixtures.sspAsset.serial_number);
        });

        customerLoginScenario.execute({
          email: dynamicFixtures.customer.email,
          password: staticFixtures.defaultPassword,
          withoutSession: true,
        });

        yvesSspAssetDetailPage.visit({
          qs: { reference: assetReference },
        });

        assertYvesAssetDetails(yvesSspAssetDetailPage, {
          reference: assetReference,
          name: staticFixtures.sspAsset.name,
          image: staticFixtures.sspAsset.image,
          serialNumber: staticFixtures.sspAsset.serial_number,
          note: staticFixtures.sspAsset.note,
        });
      });

      sspModelListPage.visit();
      sspModelListPage.verifyModelInTable({ name: staticFixtures.sspAsset.name });
    });

    it('should update an existing asset', () => {
      assetManagementUpdatePage.visit({
        qs: { 'id-ssp-asset': dynamicFixtures.sspAsset.id_ssp_asset },
      });

      assetManagementUpdatePage.updateAssetForm({
        name: staticFixtures.sspAssetOverride.name,
        serialNumber: staticFixtures.sspAssetOverride.serial_number,
        note: staticFixtures.sspAssetOverride.note,
        status: staticFixtures.sspAssetOverride.status,
        businessUnitOwner: { name: dynamicFixtures.businessUnit2.name },
        assignedbusinessUnits: [
          { name: dynamicFixtures.businessUnit2.name },
          { name: dynamicFixtures.businessUnit3.name },
        ],
        companies: [{ name: dynamicFixtures.company1.name }, { name: dynamicFixtures.company2.name }],
      });

      assetManagementUpdatePage.submitForm();
      assetManagementUpdatePage
        .getSuccessMessage()
        .should('contain', assetManagementUpdatePage.getSuccessMessageText());
      assetManagementDetailPage.assertPageLocation();
      verifyAssetDetails(assetManagementDetailPage, {
        reference: staticFixtures.sspAsset.reference,
        name: staticFixtures.sspAssetOverride.name,
        serialNumber: staticFixtures.sspAssetOverride.serial_number,
        note: staticFixtures.sspAssetOverride.note,
        status: staticFixtures.sspAssetOverride.status,
        businessUnitOwner: { name: dynamicFixtures.businessUnit2.name },
        assignedbusinessUnits: [
          { name: dynamicFixtures.businessUnit2.name },
          { name: dynamicFixtures.businessUnit3.name },
        ],
        companies: [{ name: dynamicFixtures.company1.name }, { name: dynamicFixtures.company2.name }],
        orderReference: dynamicFixtures.salesOrder.order_reference,
      });
    });
  }
);
