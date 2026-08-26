import { container } from '@utils';
import { CustomerLoginScenario } from '@scenarios/yves';
import { CustomerProfilePage } from '@pages/yves';
import { ActionEnum, CustomerEditPage, CustomerIndexPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerProfileManagementDynamicFixtures, CustomerProfileManagementStaticFixtures } from '@interfaces/yves';

describe(
  'customer profile management',
  {
    tags: ['@yves', '@customer-account-management', 'spryker-core', 'customer-account-management'],
  },
  (): void => {
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerProfilePage = container.get(CustomerProfilePage);
    const customerIndexPage = container.get(CustomerIndexPage);
    const customerEditPage = container.get(CustomerEditPage);
    const userLoginScenario = container.get(UserLoginScenario);

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

      customerProfilePage.getProfileSavedMessage().should('be.visible');
    });

    it('customer should be able to save the profile without changing the email', (): void => {
      customerProfilePage.visit();
      customerProfilePage.updateEmail(dynamicFixtures.customer.email);

      customerProfilePage.getProfileSavedMessage().should('be.visible');
    });

    it('customer should not be able to update the email to an already used one', (): void => {
      customerProfilePage.visit();
      customerProfilePage.updateEmail(dynamicFixtures.existingCustomer.email);

      customerProfilePage.getEmailInUseError().should('be.visible');
    });

    it('customer should be able to change their password', (): void => {
      const currentPassword = staticFixtures.defaultPassword;
      const newPassword = staticFixtures.newPassword;

      customerProfilePage.visit();
      customerProfilePage.changePassword(currentPassword, newPassword);

      customerProfilePage.getPasswordChangedMessage().should('be.visible');
    });

    it('customer should not be able to change the password when the new passwords do not match', (): void => {
      const currentPassword = staticFixtures.defaultPassword;
      const newPassword = staticFixtures.newPassword;

      customerProfilePage.visit();
      customerProfilePage.changePassword(currentPassword, newPassword, 'not matching password');

      customerProfilePage.getPasswordsDoNotMatchError().should('be.visible');
    });

    it('customer should see a profile change an administrator made in the back office', (): void => {
      // Arrange
      const salutation = 'Dr';
      const firstName = 'BackofficeEdited';
      const lastName = 'BackofficeEdited';

      // Act
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      customerIndexPage.visit();
      customerIndexPage.update({ action: ActionEnum.edit, searchQuery: dynamicFixtures.customer.email });
      customerEditPage.update({ salutation: salutation, firstName: firstName, lastName: lastName });

      // Logging in to the back office cleared the storefront session, so it has to be
      // re-established before the profile page is reachable again.
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      customerProfilePage.visit();

      // Assert
      customerProfilePage.getSalutationSelect().should('have.value', salutation);
      customerProfilePage.getFirstNameInput().should('have.value', firstName);
      customerProfilePage.getLastNameInput().should('have.value', lastName);
    });
  }
);
