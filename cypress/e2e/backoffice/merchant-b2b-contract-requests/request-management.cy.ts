import { container } from '@utils';
import { RequestManagementDynamicFixtures, RequestManagementStaticFixtures } from '../../../support/types/backoffice';
import { UserLoginScenario } from '../../../support/scenarios/backoffice';
import {
  MerchantRelationRequestGuiEditPage,
  MerchantRelationRequestGuiListPage,
  MerchantRelationshipGuiListPage,
} from '../../../support/pages/backoffice';

/**
 * Merchant Relation Requests & Enhanced Merchant Relations checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4105896492/Business+Journey+B2B+Marketplace+-+to+automate}
 */
describe('request management', { tags: ['@merchant-b2b-contract-requests'] }, (): void => {
  const merchantRelationRequestGuiListPage = container.get(MerchantRelationRequestGuiListPage);
  const merchantRelationRequestGuiEditPage = container.get(MerchantRelationRequestGuiEditPage);
  const merchantRelationshipGuiListPage = container.get(MerchantRelationshipGuiListPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let dynamicFixtures: RequestManagementDynamicFixtures;
  let staticFixtures: RequestManagementStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('operator should be able to see all requests from all merchants', (): void => {
    const merchants = [dynamicFixtures.merchant1, dynamicFixtures.merchant2, dynamicFixtures.merchant3];

    merchants.forEach((merchant) => {
      merchantRelationRequestGuiListPage.visit();
      merchantRelationRequestGuiListPage.editLastRequest({ idMerchant: merchant.id_merchant });
      cy.contains(merchant.name);
    });
  });

  it('operator should be able to see internal comments from all merchant users', (): void => {
    merchantRelationRequestGuiListPage.visit();
    merchantRelationRequestGuiListPage.editLastRequest({ idMerchant: dynamicFixtures.merchant1.id_merchant });

    cy.contains(staticFixtures.internalCommentFromMerchantUser1);
    cy.contains(staticFixtures.internalCommentFromMerchantUser2);
  });

  it('operator should be able to add internal comment', (): void => {
    merchantRelationRequestGuiListPage.visit();
    merchantRelationRequestGuiListPage.editLastRequest({ idMerchant: dynamicFixtures.merchant1.id_merchant });
    merchantRelationRequestGuiEditPage.addInternalComment(staticFixtures.internalCommentFromRootUser);

    merchantRelationRequestGuiListPage.visit();
    merchantRelationRequestGuiListPage.editLastRequest({ idMerchant: dynamicFixtures.merchant1.id_merchant });
    cy.contains(staticFixtures.internalCommentFromRootUser);
  });

  it('operator should be able to reject request', (): void => {
    merchantRelationRequestGuiListPage.visit();
    merchantRelationRequestGuiListPage.editLastRequest({ idMerchant: dynamicFixtures.merchant3.id_merchant });
    merchantRelationRequestGuiEditPage.rejectRequest();

    merchantRelationRequestGuiListPage.visit();
    merchantRelationRequestGuiListPage.viewLastRequest({ idMerchant: dynamicFixtures.merchant3.id_merchant });
    cy.contains('Rejected');

    merchantRelationshipGuiListPage.visit();
    merchantRelationshipGuiListPage.applyFilters({ idCompany: dynamicFixtures.company2.id_company });
    merchantRelationshipGuiListPage.getEditButtons().should('have.length', 0);
  });

  it('operator should be able to approve request (additionally copy internal comments to relation)', (): void => {
    merchantRelationRequestGuiListPage.visit();
    merchantRelationRequestGuiListPage.editLastRequest({ idMerchant: dynamicFixtures.merchant1.id_merchant });
    merchantRelationRequestGuiEditPage.approveRequest(false);

    merchantRelationRequestGuiListPage.visit();
    merchantRelationRequestGuiListPage.viewLastRequest({ idMerchant: dynamicFixtures.merchant1.id_merchant });
    cy.contains('Approved');

    merchantRelationshipGuiListPage.visit();
    merchantRelationshipGuiListPage.editLastRelation({ idCompany: dynamicFixtures.company1.id_company });

    cy.contains(staticFixtures.internalCommentFromMerchantUser1);
    cy.contains(staticFixtures.internalCommentFromMerchantUser2);
  });

  it('operator should be able to approve request with enabled BU splitting', (): void => {
    merchantRelationRequestGuiListPage.visit();
    merchantRelationRequestGuiListPage.editLastRequest({ idMerchant: dynamicFixtures.merchant2.id_merchant });
    merchantRelationRequestGuiEditPage.approveRequest(true);

    merchantRelationRequestGuiListPage.visit();
    merchantRelationRequestGuiListPage.viewLastRequest({ idMerchant: dynamicFixtures.merchant2.id_merchant });
    cy.contains('Approved');

    merchantRelationshipGuiListPage.visit();
    merchantRelationshipGuiListPage.applyFilters({ idCompany: dynamicFixtures.company2.id_company });
    merchantRelationshipGuiListPage.getEditButtons().should('have.length', 2);
  });
});
