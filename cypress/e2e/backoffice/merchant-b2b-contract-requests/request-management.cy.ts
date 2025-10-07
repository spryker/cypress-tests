import { container } from '@utils';
import { RequestManagementDynamicFixtures, RequestManagementStaticFixtures } from '@interfaces/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import {
  ActionEnum,
  MerchantRelationRequestEditPage,
  MerchantRelationRequestListPage,
  MerchantRelationshipListPage,
} from '@pages/backoffice';

/**
 * Merchant Relation Requests & Enhanced Merchant Relations checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4105896492/Business+Journey+B2B+Marketplace+-+to+automate}
 */
(['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'request management',
  { tags: ['@backoffice', '@merchant-b2b-contract-requests', 'merchant-contract-requests', 'marketplace-merchant-contract-requests', 'merchant-contracts'] },
  (): void => {
    const merchantRelationRequestListPage = container.get(MerchantRelationRequestListPage);
    const merchantRelationRequestEditPage = container.get(MerchantRelationRequestEditPage);
    const merchantRelationshipListPage = container.get(MerchantRelationshipListPage);
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
        merchantRelationRequestListPage.visit();
        merchantRelationRequestListPage.update({
          action: ActionEnum.edit,
          idMerchant: merchant.id_merchant,
        });

        cy.contains(merchant.name);
      });
    });

    it('operator should be able to see internal comments from all merchant users', (): void => {
      merchantRelationRequestListPage.visit();
      merchantRelationRequestListPage.update({
        action: ActionEnum.edit,
        idMerchant: dynamicFixtures.merchant1.id_merchant,
        idRelationRequest: dynamicFixtures.requestFromMerchant1.id_merchant_relation_request,
      });

      cy.contains(staticFixtures.internalCommentFromMerchantUser1);
      cy.contains(staticFixtures.internalCommentFromMerchantUser2);
    });

    it('operator should be able to add internal comment', (): void => {
      merchantRelationRequestListPage.visit();
      merchantRelationRequestListPage.update({
        action: ActionEnum.edit,
        idMerchant: dynamicFixtures.merchant1.id_merchant,
        idRelationRequest: dynamicFixtures.requestFromMerchant1.id_merchant_relation_request,
      });

      merchantRelationRequestEditPage.addInternalComment({ comment: staticFixtures.internalCommentFromRootUser });

      merchantRelationRequestListPage.visit();
      merchantRelationRequestListPage.update({
        action: ActionEnum.edit,
        idMerchant: dynamicFixtures.merchant1.id_merchant,
        idRelationRequest: dynamicFixtures.requestFromMerchant1.id_merchant_relation_request,
      });

      cy.contains(staticFixtures.internalCommentFromRootUser);
    });

    it('operator should be able to add internal comment with emoji', (): void => {
      merchantRelationRequestListPage.visit();
      merchantRelationRequestListPage.update({
        action: ActionEnum.edit,
        idMerchant: dynamicFixtures.merchant1.id_merchant,
      });

      merchantRelationRequestEditPage.addInternalComment({
        comment: staticFixtures.internalCommentFromRootUserWithEmoji,
      });

      merchantRelationRequestListPage.visit();
      merchantRelationRequestListPage.update({
        action: ActionEnum.edit,
        idMerchant: dynamicFixtures.merchant1.id_merchant,
      });

      cy.contains(staticFixtures.internalCommentFromRootUserWithEmoji);
    });

    it('operator should be able to reject request', (): void => {
      merchantRelationRequestListPage.visit();
      merchantRelationRequestListPage.update({
        action: ActionEnum.edit,
        idMerchant: dynamicFixtures.merchant3.id_merchant,
      });

      merchantRelationRequestEditPage.reject();

      merchantRelationRequestListPage.visit();
      merchantRelationRequestListPage.update({
        action: ActionEnum.view,
        idMerchant: dynamicFixtures.merchant3.id_merchant,
      });

      cy.contains('Rejected');

      merchantRelationshipListPage.visit();
      merchantRelationshipListPage.applyFilters({ idCompany: dynamicFixtures.company2.id_company });
      merchantRelationshipListPage.getEditButtons().should('have.length', 0);
    });

    it('operator should be able to approve request (additionally copy internal comments to relation)', (): void => {
      merchantRelationRequestListPage.visit();
      merchantRelationRequestListPage.update({
        action: ActionEnum.edit,
        idMerchant: dynamicFixtures.merchant1.id_merchant,
        idRelationRequest: dynamicFixtures.requestFromMerchant1.id_merchant_relation_request,
      });

      merchantRelationRequestEditPage.approve({ isSplitEnabled: false });

      merchantRelationRequestListPage.visit();
      merchantRelationRequestListPage.update({
        action: ActionEnum.view,
        idMerchant: dynamicFixtures.merchant1.id_merchant,
        idRelationRequest: dynamicFixtures.requestFromMerchant1.id_merchant_relation_request,
      });
      cy.contains('Approved');

      merchantRelationshipListPage.visit();
      merchantRelationshipListPage.update({ idCompany: dynamicFixtures.company1.id_company });

      cy.contains(staticFixtures.internalCommentFromMerchantUser1);
      cy.contains(staticFixtures.internalCommentFromMerchantUser2);
    });

    it('operator should be able to approve request with enabled BU splitting', (): void => {
      merchantRelationRequestListPage.visit();
      merchantRelationRequestListPage.update({
        action: ActionEnum.edit,
        idMerchant: dynamicFixtures.merchant2.id_merchant,
        idRelationRequest: dynamicFixtures.requestFromMerchant2.id_merchant_relation_request,
      });

      merchantRelationRequestEditPage.approve({ isSplitEnabled: true });

      merchantRelationRequestListPage.visit();
      merchantRelationRequestListPage.update({
        action: ActionEnum.view,
        idMerchant: dynamicFixtures.merchant2.id_merchant,
        idRelationRequest: dynamicFixtures.requestFromMerchant2.id_merchant_relation_request,
      });
      cy.contains('Approved');

      merchantRelationshipListPage.visit();
      merchantRelationshipListPage.applyFilters({ idCompany: dynamicFixtures.company2.id_company });
      merchantRelationshipListPage.getEditButtons().should('have.length', 2);
    });
  }
);
