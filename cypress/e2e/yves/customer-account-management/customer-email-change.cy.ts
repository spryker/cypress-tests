import { container } from '@utils';
import { CustomerLoginScenario } from '@scenarios/yves';
import { CustomerProfilePage } from '@pages/yves';
import { CustomerEmailChangeDynamicFixtures, CustomerEmailChangeStaticFixtures } from '@interfaces/yves';

describe(
  'customer email change',
  {
    tags: ['@yves', '@customer-account-management', 'spryker-core', 'customer-account-management'],
  },
  (): void => {
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerProfilePage = container.get(CustomerProfilePage);

    let dynamicFixtures: CustomerEmailChangeDynamicFixtures;
    let staticFixtures: CustomerEmailChangeStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    function loginAs(email: string): void {
      customerLoginScenario.execute({
        email: email,
        password: staticFixtures.defaultPassword,
      });
    }

    function getNewEmail(prefix: string, currentEmail: string): string {
      return `${prefix}-${currentEmail}`;
    }

    it('customer should receive a verification email when changing the email', (): void => {
      const newEmail = getNewEmail('new', dynamicFixtures.customer.email);

      loginAs(dynamicFixtures.customer.email);
      customerProfilePage.visit();
      customerProfilePage.updateEmail(newEmail);

      customerProfilePage.getEmailChangeMailSentMessage().should('be.visible');
      customerProfilePage.getEmailChangeRequestedNotice().should('contain', newEmail);
      customerProfilePage.getEmailInput().should('have.value', dynamicFixtures.customer.email);
    });

    it('customer should not receive a second verification email while the email change request is pending', (): void => {
      const customerEmail = dynamicFixtures.customerWithPendingEmailChange.email;

      loginAs(customerEmail);
      customerProfilePage.visit();
      customerProfilePage.updateEmail(getNewEmail('first', customerEmail));
      customerProfilePage.getEmailChangeMailSentMessage().should('be.visible');

      customerProfilePage.updateEmail(getNewEmail('second', customerEmail));

      customerProfilePage.getEmailChangePendingRequestExistsError().should('be.visible');
      customerProfilePage.getEmailChangeMailSentMessage().should('not.exist');
      customerProfilePage.getEmailInput().should('have.value', customerEmail);
    });
  }
);
