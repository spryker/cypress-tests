import { container } from '@utils';
import { CustomerLoginScenario } from '@scenarios/yves';
import { CustomerNewsletterPage, CustomerOverviewPage, LoginPage } from '@pages/yves';
import { NewsletterSubscriptionDynamicFixtures, NewsletterSubscriptionStaticFixtures } from '@interfaces/yves';

describe(
  'newsletter subscription',
  {
    tags: ['@yves', '@customer-account-management', 'spryker-core', 'customer-account-management'],
  },
  (): void => {
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerNewsletterPage = container.get(CustomerNewsletterPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const loginPage = container.get(LoginPage);

    let dynamicFixtures: NewsletterSubscriptionDynamicFixtures;
    let staticFixtures: NewsletterSubscriptionStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('logged-in customer should be able to subscribe to the newsletter on the account page', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      customerNewsletterPage.visit();
      customerNewsletterPage.toggleAccountSubscriptionAndSubmit();

      customerNewsletterPage.assertSubscribed();
    });

    it('guest should be able to subscribe with a not-yet-subscribed email on the homepage', (): void => {
      const email = `newsletter-fresh-${Date.now()}@example.com`;

      customerNewsletterPage.visitHomepage();
      customerNewsletterPage.subscribeOnHomepage(email);

      customerNewsletterPage.assertSubscribed();
    });

    it('guest should not be able to subscribe with an already-subscribed email', (): void => {
      const email = `newsletter-dup-${Date.now()}@example.com`;

      customerNewsletterPage.visitHomepage();
      customerNewsletterPage.subscribeOnHomepage(email);
      customerNewsletterPage.assertSubscribed();

      customerNewsletterPage.visitHomepage();
      customerNewsletterPage.subscribeOnHomepage(email);
      customerNewsletterPage.assertAlreadySubscribed();
    });

    skipB2BIt('guest newsletter subscription should be linked to the customer after registration', (): void => {
      const email = `newsletter-link-${Date.now()}@example.com`;

      customerNewsletterPage.visitHomepage();
      customerNewsletterPage.subscribeOnHomepage(email);
      customerNewsletterPage.assertSubscribed();

      loginPage.visit();
      const registeredCustomer = loginPage.register({ email });
      cy.contains(loginPage.getRegistrationCompletedMessage());

      customerLoginScenario.execute({ email: registeredCustomer.email, password: registeredCustomer.password });

      customerOverviewPage.visit();
      cy.contains('Newsletter subscribed').should('be.visible');
    });

    skipB2BIt('registered customer should be able to unsubscribe a linked newsletter subscription', (): void => {
      const email = `newsletter-unlink-${Date.now()}@example.com`;

      customerNewsletterPage.visitHomepage();
      customerNewsletterPage.subscribeOnHomepage(email);
      customerNewsletterPage.assertSubscribed();

      loginPage.visit();
      const registeredCustomer = loginPage.register({ email });
      cy.contains(loginPage.getRegistrationCompletedMessage());

      customerLoginScenario.execute({ email: registeredCustomer.email, password: registeredCustomer.password });

      customerOverviewPage.visit();
      cy.contains('Newsletter subscribed').should('be.visible');

      customerNewsletterPage.visit();
      customerNewsletterPage.toggleAccountSubscriptionAndSubmit();

      customerNewsletterPage.assertUnsubscribed();
      customerNewsletterPage.assertAccountSubscriptionUnchecked();
    });

    function skipB2BIt(description: string, testFn: () => void): void {
      (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
    }
  }
);
