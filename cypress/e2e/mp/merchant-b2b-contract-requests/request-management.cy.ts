import { container } from '@utils';
import { RequestManagementDynamicFixtures, RequestManagementStaticFixtures } from '@interfaces/mp';
import { MerchantRelationRequestsPage, MerchantRelationsPage } from '@pages/mp';
import { MerchantUserLoginScenario } from '@scenarios/mp';

/**
 * Merchant Relation Requests & Enhanced Merchant Relations checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4105896492/Business+Journey+B2B+Marketplace+-+to+automate}
 */
(Cypress.env('repositoryId') === 'b2b' ? describe.skip : describe)(
  'request management',
  { tags: ['@merchant-b2b-contract-requests'] },
  (): void => {
    const merchantRelationRequestsPage = container.get(MerchantRelationRequestsPage);
    const merchantRelationsPage = container.get(MerchantRelationsPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let dynamicFixtures: RequestManagementDynamicFixtures;
    let staticFixtures: RequestManagementStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('merchant user should be able to see request note from company user', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUserFromMerchant2.username,
        password: staticFixtures.defaultPassword,
      });

      merchantRelationRequestsPage.visit();
      merchantRelationRequestsPage.find({ query: dynamicFixtures.businessUnit1FromCompany1.name }).click();
      merchantRelationRequestsPage.getDrawer();

      merchantRelationRequestsPage.getMessageFromCompanyValue().should('eq', staticFixtures.requestNote);
    });

    it('all merchant users should be able see merchant relation requests', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser1FromMerchant1.username,
        password: staticFixtures.defaultPassword,
      });

      merchantRelationRequestsPage.visit();
      merchantRelationRequestsPage.find({ query: dynamicFixtures.businessUnit1FromCompany1.name }).should('exist');

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser2FromMerchant1.username,
        password: staticFixtures.defaultPassword,
      });

      merchantRelationRequestsPage.visit();
      merchantRelationRequestsPage.find({ query: dynamicFixtures.businessUnit1FromCompany1.name }).should('exist');
    });

    it('merchant user should be able to left internal comments', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser1FromMerchant1.username,
        password: staticFixtures.defaultPassword,
      });

      merchantRelationRequestsPage.visit();
      merchantRelationRequestsPage.find({ query: dynamicFixtures.businessUnit1FromCompany1.name }).click();
      merchantRelationRequestsPage.getDrawer();
      merchantRelationRequestsPage.addInternalComment({ comment: staticFixtures.internalComment });

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser2FromMerchant1.username,
        password: staticFixtures.defaultPassword,
      });

      merchantRelationRequestsPage.visit();
      merchantRelationRequestsPage.find({ query: dynamicFixtures.businessUnit1FromCompany1.name }).click();
      merchantRelationRequestsPage.getDrawer().contains(staticFixtures.internalComment);
    });

    it('merchant user should be able to approve request with BU splitting', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser1FromMerchant1.username,
        password: staticFixtures.defaultPassword,
      });

      merchantRelationRequestsPage.visit();
      merchantRelationRequestsPage.find({ query: dynamicFixtures.businessUnit2FromCompany1.name }).click();
      merchantRelationRequestsPage.getDrawer();
      merchantRelationRequestsPage.addInternalComment({ comment: staticFixtures.internalComment });
      merchantRelationRequestsPage.approve({ isSplitEnabled: true });

      merchantRelationsPage.visit();
      merchantRelationsPage.find({ query: dynamicFixtures.businessUnit6FromCompany1.name }).click();
      merchantRelationsPage.getDrawer().contains(staticFixtures.internalComment);

      merchantRelationsPage.visit();
      merchantRelationsPage.find({ query: dynamicFixtures.businessUnit7FromCompany1.name }).click();
      merchantRelationsPage.getDrawer().contains(staticFixtures.internalComment);
    });

    it('merchant user should be able to reject request', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUserFromMerchant2.username,
        password: staticFixtures.defaultPassword,
      });

      merchantRelationRequestsPage.visit();
      merchantRelationRequestsPage.find({ query: dynamicFixtures.businessUnit1FromCompany1.name }).click();
      merchantRelationRequestsPage.getDrawer();
      merchantRelationRequestsPage.reject();

      merchantRelationRequestsPage.visit();
      merchantRelationRequestsPage.find({ query: dynamicFixtures.businessUnit1FromCompany1.name }).click();
      merchantRelationRequestsPage.getDrawer().contains('Rejected');
    });

    it('merchant user should not be able to approve request with deselected business units', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUserFromMerchant2.username,
        password: staticFixtures.defaultPassword,
      });

      merchantRelationRequestsPage.visit();
      merchantRelationRequestsPage.find({ query: dynamicFixtures.businessUnit2FromCompany1.name }).click();
      merchantRelationRequestsPage.getDrawer();

      merchantRelationRequestsPage.uncheckBusinessUnits({
        businessUnitIds: [
          dynamicFixtures.businessUnit6FromCompany1.id_company_business_unit,
          dynamicFixtures.businessUnit7FromCompany1.id_company_business_unit,
        ],
      });
      merchantRelationRequestsPage.approve();

      merchantRelationRequestsPage.visit();
      merchantRelationRequestsPage.find({ query: dynamicFixtures.businessUnit2FromCompany1.name }).click();
      merchantRelationRequestsPage.getDrawer().contains('Pending');
    });

    it('merchant user should be able to revise and approve request', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUserFromMerchant2.username,
        password: staticFixtures.defaultPassword,
      });

      merchantRelationRequestsPage.visit();
      merchantRelationRequestsPage.find({ query: dynamicFixtures.businessUnit2FromCompany1.name }).click();

      merchantRelationRequestsPage.getDrawer();
      merchantRelationRequestsPage.uncheckBusinessUnits({
        businessUnitIds: [dynamicFixtures.businessUnit6FromCompany1.id_company_business_unit],
      });
      merchantRelationRequestsPage.approve();

      merchantRelationsPage.visit();
      merchantRelationsPage.find({ query: dynamicFixtures.businessUnit6FromCompany1.name, expectedCount: 0 });
      merchantRelationsPage.find({ query: dynamicFixtures.businessUnit7FromCompany1.name }).click();
      merchantRelationsPage.getDrawer().contains(dynamicFixtures.businessUnit7FromCompany1.name);
    });
  }
);
