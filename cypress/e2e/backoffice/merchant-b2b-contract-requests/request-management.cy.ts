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
describe(
  'request management',
  {
    tags: [
      '@backoffice',
      '@merchant-b2b-contract-requests',
      'merchant-contract-requests',
      'marketplace-merchant-contract-requests',
      'merchant-contracts',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped due to repo being b2c or b2c-mp', () => {});
      return;
    }
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
      merchantRelationRequestListPage.assertBodyContainsText('Approved');

      merchantRelationshipListPage.visit();
      merchantRelationshipListPage.update({ idCompany: dynamicFixtures.company1.id_company });

      merchantRelationshipListPage.assertBodyContainsText(staticFixtures.internalCommentFromMerchantUser1);
      merchantRelationshipListPage.assertBodyContainsText(staticFixtures.internalCommentFromMerchantUser2);
    });
  }
);
