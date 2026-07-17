import { container } from '@utils';
import { CustomerLoginScenario } from '@scenarios/yves';
import { CustomerAddressPage } from '@pages/yves';
import { CustomerAddressManagementDynamicFixtures, CustomerAddressManagementStaticFixtures } from '@interfaces/yves';

describe(
  'customer address management',
  {
    tags: ['@yves', '@customer-account-management', 'spryker-core', 'customer-account-management'],
  },
  (): void => {
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerAddressPage = container.get(CustomerAddressPage);

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

      customerAddressPage.fillAndSubmitNewAddress({
        salutation: 'Mr',
        firstName: 'Cat',
        lastName: 'Face',
        company: 'Spryker',
        phone: '123456789',
        address1: 'address a',
        address2: '1',
        address3: 'left side',
        city: 'Berlin',
        zipCode: '12345',
        iso2Code: 'DE',
      });

      customerAddressPage.waitForAddressAddedMessage();
    });

    it('customer should be able to open the add-address page from the addresses list', (): void => {
      customerAddressPage.visit();
      customerAddressPage.clickAddNewAddress();

      cy.url().should('include', '/customer/address/new');
    });
  }
);
