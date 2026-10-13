import { container } from '@utils';
import { MerchantCrudDynamicFixtures, MerchantCrudStaticFixtures } from '@interfaces/backoffice';
import { ActionEnum, MerchantCreatePage, MerchantListPage, MerchantUpdatePage } from '@pages/backoffice';
import { MerchantPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

const MERCHANT_PROFILE_SELECTOR = '[data-qa="component merchant-profile"]';

describe(
  'merchant crud',
  {
    tags: [
      '@backoffice',
      '@marketplace-merchant',
      'marketplace-merchant',
      'merchant',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because merchants exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const merchantCreatePage = container.get(MerchantCreatePage);
    const merchantListPage = container.get(MerchantListPage);
    const merchantUpdatePage = container.get(MerchantUpdatePage);
    const merchantPage = container.get(MerchantPage);
    const userLoginScenario = container.get(UserLoginScenario);

    const publishAndSyncCommands = [
      'console publish:trigger-events -r merchant',
      'console queue:worker:start --stop-when-empty',
    ];

    let staticFixtures: MerchantCrudStaticFixtures;
    let dynamicFixtures: MerchantCrudDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('given a back office user when a merchant is created inactive for a store then the merchant list shows it inactive, waiting for approval and assigned to that store', (): void => {
      // Arrange
      merchantCreatePage.visit();

      // Act
      const merchant = merchantCreatePage.create({ isActive: false, storeName: 'DE' });

      // Assert
      merchantListPage.visit();
      merchantListPage.findRow({ query: merchant.name }).should('contain.text', 'Inactive');
      merchantListPage.findRow({ query: merchant.name }).should('contain.text', 'Waiting for Approval');
      merchantListPage.findRow({ query: merchant.name }).should('contain.text', 'DE');
    });

    it('given an inactive merchant waiting for approval when the back office activates and approves it then the merchant list shows it active and approved', (): void => {
      // Arrange
      merchantListPage.visit();

      // Act
      merchantListPage.update({ query: dynamicFixtures.merchantWaitingForApproval.name, action: ActionEnum.activate });
      merchantListPage.update({
        query: dynamicFixtures.merchantWaitingForApproval.name,
        action: ActionEnum.approveAccess,
      });

      // Assert
      merchantListPage
        .findRow({ query: dynamicFixtures.merchantWaitingForApproval.name })
        .should('contain.text', 'Active');
      merchantListPage
        .findRow({ query: dynamicFixtures.merchantWaitingForApproval.name })
        .should('contain.text', 'Approved');
    });

    it('given a merchant served on the storefront when the back office renames it then the storefront serves the new name', (): void => {
      // Arrange
      const renamedMerchantName = `${dynamicFixtures.renamedMerchant.name} renamed`;

      cy.reloadUntilFound(
        dynamicFixtures.renamedMerchantUrlEN.url,
        MERCHANT_PROFILE_SELECTOR,
        'body',
        10,
        3000,
        publishAndSyncCommands
      );
      merchantPage.getBody().should('not.contain.text', renamedMerchantName);

      // Act
      merchantListPage.visit();
      merchantListPage.update({ query: dynamicFixtures.renamedMerchant.name, action: ActionEnum.edit });
      merchantUpdatePage.rename({ name: renamedMerchantName });

      // Assert
      // The publish commands run before every visit, so the page is rendered from the renamed
      // storage entry. The merchant name is the page heading, outside the profile component itself.
      cy.reloadUntilFound(
        dynamicFixtures.renamedMerchantUrlEN.url,
        MERCHANT_PROFILE_SELECTOR,
        'body',
        10,
        3000,
        publishAndSyncCommands
      );
      merchantPage.getBody().should('contain.text', renamedMerchantName);
    });

    it('given a merchant served on the storefront when the back office unassigns all its stores then the storefront retires its page', (): void => {
      // Arrange
      cy.reloadUntilFound(
        dynamicFixtures.unassignedMerchantUrlEN.url,
        MERCHANT_PROFILE_SELECTOR,
        'body',
        10,
        3000,
        publishAndSyncCommands
      );

      // Act
      merchantListPage.visit();
      merchantListPage.update({ query: dynamicFixtures.unassignedMerchant.name, action: ActionEnum.edit });
      merchantUpdatePage.unassignAllStores();

      // Assert
      cy.reloadUntilGone(
        dynamicFixtures.unassignedMerchantUrlEN.url,
        MERCHANT_PROFILE_SELECTOR,
        'body',
        10,
        3000,
        publishAndSyncCommands
      );
    });
  }
);
