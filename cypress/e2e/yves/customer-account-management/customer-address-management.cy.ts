import { container } from '@utils';
import { CustomerLoginScenario } from '@scenarios/yves';
import { CustomerAddressPage } from '@pages/yves';
import { ActionEnum, CustomerAddressCreatePage, CustomerIndexPage, CustomerViewPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerAddressManagementDynamicFixtures, CustomerAddressManagementStaticFixtures } from '@interfaces/yves';

describe(
  'customer address management',
  {
    tags: ['@yves', '@customer-account-management', 'spryker-core', 'customer-account-management'],
  },
  (): void => {
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerAddressPage = container.get(CustomerAddressPage);
    const customerIndexPage = container.get(CustomerIndexPage);
    const customerViewPage = container.get(CustomerViewPage);
    const customerAddressCreatePage = container.get(CustomerAddressCreatePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let dynamicFixtures: CustomerAddressManagementDynamicFixtures;
    let staticFixtures: CustomerAddressManagementStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    });

    it('customer should be able to add a new address', (): void => {
      customerAddressPage.visitNewAddressPage();

      customerAddressPage.fillAndSubmitNewAddress(staticFixtures.newAddress);

      customerAddressPage.getAddressAddedMessage().should('be.visible');
    });

    it('customer should be able to open the add-address page from the addresses list', (): void => {
      customerAddressPage.visit();
      customerAddressPage.clickAddNewAddress();

      cy.url().should('include', '/customer/address/new');
    });

    it('customer should be able to delete an address', (): void => {
      // Arrange
      // A street unique to this run, so that asserting the address is gone cannot match another
      // address left behind by an earlier test in this file.
      const street = `${staticFixtures.newAddress.address1} ${Date.now()}`;
      const address = { ...staticFixtures.newAddress, address1: street };

      customerAddressPage.visitNewAddressPage();
      customerAddressPage.fillAndSubmitNewAddress(address);
      customerAddressPage.getAddressAddedMessage().should('be.visible');

      customerAddressPage.visit();
      customerAddressPage.getAddressListEntry(street).should('exist');

      // Act
      customerAddressPage.deleteAddress(street);

      // Assert
      customerAddressPage.visit();
      customerAddressPage.getBody().should('not.contain.text', street);
    });

    it('customer should see an address an administrator added in the back office', (): void => {
      // Arrange
      const street = `Backoffice Street ${Date.now()}`;

      // Act
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      customerIndexPage.visit();
      customerIndexPage.update({ action: ActionEnum.view, searchQuery: dynamicFixtures.customer.email });
      customerViewPage.clickAddNewAddress();
      customerAddressCreatePage.create({
        salutation: staticFixtures.newAddress.salutation,
        firstName: staticFixtures.newAddress.firstName,
        lastName: staticFixtures.newAddress.lastName,
        address1: street,
        city: staticFixtures.newAddress.city,
        zipCode: staticFixtures.newAddress.zipCode,
        country: staticFixtures.backofficeAddressCountry,
      });

      // Logging in to the back office cleared the storefront session, so it has to be
      // re-established before the address list is reachable again.
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      customerAddressPage.visit();

      // Assert
      customerAddressPage.getAddressListEntry(street).should('exist');
    });
  }
);
