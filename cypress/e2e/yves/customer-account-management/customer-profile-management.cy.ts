import { container } from '@utils';
import { CustomerLoginScenario } from '@scenarios/yves';
import { CustomerProfilePage } from '@pages/yves';
import { CustomerProfileManagementDynamicFixtures, CustomerProfileManagementStaticFixtures } from '@interfaces/yves';

describe(
  'customer profile management',
  {
    tags: ['@yves', '@customer-account-management', 'spryker-core', 'customer-account-management'],
  },
  (): void => {
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerProfilePage = container.get(CustomerProfilePage);

    let dynamicFixtures: CustomerProfileManagementDynamicFixtures;
    let staticFixtures: CustomerProfileManagementStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    });

    it('customer should be able to update their profile data', (): void => {
      customerProfilePage.visit();
      customerProfilePage.updateProfileData('Mr', 'Cat', 'Face');

      customerProfilePage.assertProfileSaved();
    });

    it('customer should be able to save the profile without changing the email', (): void => {
      customerProfilePage.visit();
      customerProfilePage.updateEmail(dynamicFixtures.customer.email);

      customerProfilePage.assertProfileSaved();
    });

    it('customer should not be able to update the email to an already used one', (): void => {
      customerProfilePage.visit();
      customerProfilePage.updateEmail(dynamicFixtures.existingCustomer.email);

      customerProfilePage.assertEmailInUseError();
    });

    it('customer should be able to change their password', (): void => {
      const currentPassword = staticFixtures.defaultPassword;
      const newPassword = staticFixtures.newPassword;

      customerProfilePage.visit();
      customerProfilePage.changePassword(currentPassword, newPassword);

      customerProfilePage.waitForPasswordChangedMessage();
    });

    it('customer should not be able to change the password when the new passwords do not match', (): void => {
      const currentPassword = staticFixtures.defaultPassword;
      const newPassword = staticFixtures.newPassword;

      customerProfilePage.visit();
      customerProfilePage.changePassword(currentPassword, newPassword, 'not matching password');

      customerProfilePage.assertPasswordsDoNotMatchError();
    });
  }
);
