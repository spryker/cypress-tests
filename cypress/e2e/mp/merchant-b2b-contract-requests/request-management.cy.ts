import { container } from '@utils';
import { MerchantUserLoginScenario } from '../../../support/scenarios/mp';
import { RequestManagementDynamicFixtures, RequestManagementStaticFixtures } from '../../../support/types/mp';
import { MerchantRelationRequestsPage, MerchantRelationsPage } from '../../../support/pages/mp';

/**
 * Merchant Relation Requests & Enhanced Merchant Relations checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4105896492/Business+Journey+B2B+Marketplace+-+to+automate}
 */
describe('request management', { tags: ['@merchant-b2b-contract-requests'] }, (): void => {
  const merchantRelationRequestsPage = container.get(MerchantRelationRequestsPage);
  const merchantRelationsPage = container.get(MerchantRelationsPage);
  const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

  let dynamicFixtures: RequestManagementDynamicFixtures;
  let staticFixtures: RequestManagementStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('all merchant user should be able see merchant relation requests', (): void => {
    merchantUserLoginScenario.execute({
      username: dynamicFixtures.merchantUser1FromMerchant1.username,
      password: staticFixtures.defaultPassword,
    });

    merchantRelationRequestsPage.visit();
    merchantRelationRequestsPage.findRequest(dynamicFixtures.businessUnit1FromCompany1.name).should('exist');

    merchantUserLoginScenario.execute({
      username: dynamicFixtures.merchantUser2FromMerchant1.username,
      password: staticFixtures.defaultPassword,
    });

    merchantRelationRequestsPage.visit();
    merchantRelationRequestsPage.findRequest(dynamicFixtures.businessUnit1FromCompany1.name).should('exist');
  });

  it('merchant user should be able to left internal comments', (): void => {
    merchantUserLoginScenario.execute({
      username: dynamicFixtures.merchantUser1FromMerchant1.username,
      password: staticFixtures.defaultPassword,
    });

    merchantRelationRequestsPage.visit();
    merchantRelationRequestsPage.findRequest(dynamicFixtures.businessUnit1FromCompany1.name).click();
    merchantRelationRequestsPage.getDrawer();
    merchantRelationRequestsPage.addInternalComment(staticFixtures.internalComment);

    merchantUserLoginScenario.execute({
      username: dynamicFixtures.merchantUser2FromMerchant1.username,
      password: staticFixtures.defaultPassword,
    });

    merchantRelationRequestsPage.visit();
    merchantRelationRequestsPage.findRequest(dynamicFixtures.businessUnit1FromCompany1.name).click();
    merchantRelationRequestsPage.getDrawer().contains(staticFixtures.internalComment);
  });

  it('merchant user should be able to approve request with BU splitting', (): void => {
    merchantUserLoginScenario.execute({
      username: dynamicFixtures.merchantUser1FromMerchant1.username,
      password: staticFixtures.defaultPassword,
    });

    merchantRelationRequestsPage.visit();
    merchantRelationRequestsPage.findRequest(dynamicFixtures.businessUnit2FromCompany1.name).click();
    merchantRelationRequestsPage.getDrawer();
    merchantRelationRequestsPage.addInternalComment(staticFixtures.internalComment);
    merchantRelationRequestsPage.approveRequest(true);

    merchantRelationsPage.visit();
    merchantRelationsPage.findRelation(dynamicFixtures.businessUnit6FromCompany1.name).click();
    merchantRelationsPage.getDrawer().contains(staticFixtures.internalComment);

    merchantRelationsPage.visit();
    merchantRelationsPage.findRelation(dynamicFixtures.businessUnit7FromCompany1.name).click();
    merchantRelationsPage.getDrawer().contains(staticFixtures.internalComment);
  });

  it('merchant user should be able to reject request', (): void => {
    merchantUserLoginScenario.execute({
      username: dynamicFixtures.merchantUserFromMerchant2.username,
      password: staticFixtures.defaultPassword,
    });

    merchantRelationRequestsPage.visit();
    merchantRelationRequestsPage.findRequest(dynamicFixtures.businessUnit1FromCompany1.name).click();
    merchantRelationRequestsPage.getDrawer();
    merchantRelationRequestsPage.rejectRequest();

    merchantRelationRequestsPage.visit();
    merchantRelationRequestsPage.findRequest(dynamicFixtures.businessUnit1FromCompany1.name).click();
    merchantRelationRequestsPage.getDrawer().contains('Rejected');
  });

  it('merchant user should not be able to approve request with deselected business units', (): void => {
    merchantUserLoginScenario.execute({
      username: dynamicFixtures.merchantUserFromMerchant2.username,
      password: staticFixtures.defaultPassword,
    });

    merchantRelationRequestsPage.visit();
    merchantRelationRequestsPage.findRequest(dynamicFixtures.businessUnit2FromCompany1.name).click();
    merchantRelationRequestsPage.getDrawer();

    merchantRelationRequestsPage.uncheckBusinessUnits([
      dynamicFixtures.businessUnit6FromCompany1.id_company_business_unit,
      dynamicFixtures.businessUnit7FromCompany1.id_company_business_unit,
    ]);
    merchantRelationRequestsPage.approveRequest(false);

    merchantRelationRequestsPage.visit();
    merchantRelationRequestsPage.findRequest(dynamicFixtures.businessUnit2FromCompany1.name).click();
    merchantRelationRequestsPage.getDrawer().contains('Pending');
  });

  it('merchant user should be able to revise and approve request', (): void => {
    merchantUserLoginScenario.execute({
      username: dynamicFixtures.merchantUserFromMerchant2.username,
      password: staticFixtures.defaultPassword,
    });

    merchantRelationRequestsPage.visit();
    merchantRelationRequestsPage.findRequest(dynamicFixtures.businessUnit2FromCompany1.name).click();

    merchantRelationRequestsPage.getDrawer();
    merchantRelationRequestsPage.uncheckBusinessUnits([
      dynamicFixtures.businessUnit6FromCompany1.id_company_business_unit,
    ]);
    merchantRelationRequestsPage.approveRequest(false);

    merchantRelationsPage.visit();
    merchantRelationsPage.findRelation(dynamicFixtures.businessUnit6FromCompany1.name, 0);
    merchantRelationsPage.findRelation(dynamicFixtures.businessUnit7FromCompany1.name).click();
    merchantRelationsPage.getDrawer().contains(dynamicFixtures.businessUnit7FromCompany1.name);
  });
});
