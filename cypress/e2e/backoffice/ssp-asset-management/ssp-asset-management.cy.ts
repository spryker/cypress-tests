import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SspAssetStaticFixtures, SspAssetDynamicFixtures } from '@interfaces/backoffice';
import { SspAssetListPage, SspAssetAddPage, SspAssetDetailPage, SspAssetUpdatePage } from '@pages/backoffice/';

import { SspAssetDetailPage as YvesSspAssetDetailPage } from '@pages/yves/';
import { CustomerLoginScenario } from '@scenarios/yves';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'ssp asset management',
  { tags: ['@backoffice', '@assetManagement', '@ssp'] },
  () => {
    const userLoginScenario = container.get(UserLoginScenario);
    const assetManagementListPage = container.get(SspAssetListPage);
    const assetManagementAddPage = container.get(SspAssetAddPage);
    const assetManagementDetailPage = container.get(SspAssetDetailPage);
    const assetManagementUpdatePage = container.get(SspAssetUpdatePage);
    const yvesSspAssetDetailPage = container.get(YvesSspAssetDetailPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let dynamicFixtures: SspAssetDynamicFixtures;
    let staticFixtures: SspAssetStaticFixtures;

    before((): void => {
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
      assetManagementListPage.verifyListPage();
      assetManagementListPage.clickCreateButton();

      assetManagementAddPage.visit();
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

      assetManagementAddPage.submitForm();
      assetManagementAddPage.verifySuccessMessage();

      assetManagementDetailPage.getAssetId().then((id) => {
        staticFixtures.sspAsset.id_ssp_asset = id;
      });

      assetManagementDetailPage.getReference().then((reference) => {
        staticFixtures.sspAsset.reference = reference;

        assetManagementListPage.visit();

        assetManagementListPage.searchAsset(reference);

        cy.intercept('GET', '**/ssp-asset-management/index/table*').as('assetTableData');

        cy.wait('@assetTableData').then((interception) => {
          let displayStatus = staticFixtures.sspAsset.status;

          if (Array.isArray(staticFixtures.statuses)) {
            const matchingStatus = staticFixtures.statuses.find(
              (statusObj) => statusObj.key === staticFixtures.sspAsset.status
            );

            if (matchingStatus && matchingStatus.value) {
              displayStatus = matchingStatus.value;
            }
          }

          cy.get('table.dataTable tbody tr')
            .should('contain', staticFixtures.sspAsset.reference)
            .and('contain', staticFixtures.sspAsset.name)
            .and('contain', displayStatus)
            .and('contain', staticFixtures.sspAsset.serial_number);
        });
      });
    });

    it('should display asset details on view page', () => {
      assetManagementDetailPage.visit({
        qs: { 'id-ssp-asset': staticFixtures.sspAsset.id_ssp_asset },
      });
      assetManagementDetailPage.verifyAssetDetails({
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

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      yvesSspAssetDetailPage.visit({
        qs: { reference: staticFixtures.sspAsset.reference },
      });

      yvesSspAssetDetailPage.assertAssetDetails({
        reference: staticFixtures.sspAsset.reference,
        name: staticFixtures.sspAsset.name,
        image: staticFixtures.sspAsset.image,
        serialNumber: staticFixtures.sspAsset.serial_number,
        note: staticFixtures.sspAsset.note,
      });
    });

    it('should update an existing asset', () => {
      assetManagementUpdatePage.visit({
        qs: { 'id-ssp-asset': staticFixtures.sspAsset.id_ssp_asset },
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
      assetManagementUpdatePage.verifySuccessMessage();
      assetManagementDetailPage.assertPageLocation();
      assetManagementDetailPage.verifyAssetDetails({
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
      });
    });
  }
);
