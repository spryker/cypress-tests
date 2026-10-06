import { container } from '@utils';
import { MerchantProfileUpdateDynamicFixtures, MerchantProfileUpdateStaticFixtures } from '@interfaces/mp';
import { ProfilePage } from '@pages/mp';
import { MerchantPage } from '@pages/yves';
import { MerchantUserLoginScenario } from '@scenarios/mp';

describe(
  'merchant profile update',
  {
    tags: [
      '@mp',
      '@marketplace-merchant',
      'marketplace-merchant',
      'merchant',
      'marketplace-merchantportal-core',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the merchant portal exists only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const profilePage = container.get(ProfilePage);
    const merchantPage = container.get(MerchantPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let staticFixtures: MerchantProfileUpdateStaticFixtures;
    let dynamicFixtures: MerchantProfileUpdateDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a merchant profile edited in the merchant portal when it is published then the storefront serves the new values', (): void => {
      // Arrange
      const publicEmail = `updated-${Date.now()}@merchant-portal.test`;
      const publicPhone = '+11 222 333 444';
      const deliveryTime = '2-4 weeks';
      const dataPrivacy = 'Data privacy updated text';

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      // Act
      profilePage.visit();
      profilePage.openOnlineProfileTab();
      profilePage.updateOnlineProfile({ publicEmail, publicPhone, deliveryTime, dataPrivacy });
      profilePage.save();

      cy.runQueueWorker();

      // Assert
      merchantPage.visitProfile({ url: dynamicFixtures.merchantUrlEN.url });

      merchantPage.getInformationItemValue({ label: 'Email Address' }).should('contain.text', publicEmail);
      merchantPage.getInformationItemValue({ label: 'Phone' }).should('contain.text', publicPhone);
      merchantPage.getInformationItemValue({ label: 'Delivery Time' }).should('contain.text', deliveryTime);
      merchantPage.getProfileContent().should('contain.text', dataPrivacy);
    });
  }
);
