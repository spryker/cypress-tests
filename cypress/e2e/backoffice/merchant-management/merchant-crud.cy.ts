import { container } from '@utils';
import { MerchantCrudDynamicFixtures, MerchantCrudStaticFixtures } from '@interfaces/backoffice';
import { ActionEnum, MerchantCreatePage, MerchantListPage, MerchantUpdatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

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

    it('given a merchant created in the back office when it is approved and renamed then the storefront serves it, and unassigning its store retires the page', (): void => {
      // Arrange
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      merchantCreatePage.visit();

      // Act
      const merchant = merchantCreatePage.create({ isActive: false, storeName: 'DE' });

      // Assert
      merchantListPage.visit();
      merchantListPage.findRow({ query: merchant.name }).should('contain.text', 'Inactive');
      merchantListPage.findRow({ query: merchant.name }).should('contain.text', 'Waiting for Approval');
      merchantListPage.findRow({ query: merchant.name }).should('contain.text', 'DE');

      merchantListPage.update({ query: merchant.name, action: ActionEnum.activate });
      merchantListPage.update({ query: merchant.name, action: ActionEnum.approveAccess });

      merchantListPage.findRow({ query: merchant.name }).should('contain.text', 'Active');
      merchantListPage.findRow({ query: merchant.name }).should('contain.text', 'Approved');

      const renamedMerchant = `${merchant.name} renamed`;
      merchantListPage.update({ query: merchant.name, action: ActionEnum.edit });
      merchantUpdatePage.rename({ name: renamedMerchant });

      cy.reloadUntilFound(
        `/en/merchant/${merchant.url}`,
        '[data-qa="component merchant-profile"]',
        'body',
        10,
        3000,
        publishAndSyncCommands
      );

      // The merchant name is the page heading, which sits outside the profile component itself.
      cy.get('body').should('contain.text', renamedMerchant);

      merchantListPage.visit();
      merchantListPage.update({ query: renamedMerchant, action: ActionEnum.edit });
      merchantUpdatePage.unassignAllStores();

      cy.reloadUntilGone(
        `/en/merchant/${merchant.url}`,
        '[data-qa="component merchant-profile"]',
        'body',
        10,
        3000,
        publishAndSyncCommands
      );
    });
  }
);
