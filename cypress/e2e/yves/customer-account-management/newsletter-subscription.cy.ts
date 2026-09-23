import { container } from '@utils';
import { CustomerLoginScenario } from '@scenarios/yves';
import { CustomerNewsletterPage, CustomerOverviewPage, LoginPage } from '@pages/yves';
import { NewsletterSubscriptionDynamicFixtures, NewsletterSubscriptionStaticFixtures } from '@interfaces/yves';

// Only the suite storefront renders the guest newsletter form on the homepage.
const SUITE_REPOSITORY_ID = 'suite';

// The overview page's newsletter row label, shown once a subscription is linked to the account.
const NEWSLETTER_SUBSCRIBED_LABEL = 'Newsletter subscribed';

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

      customerNewsletterPage.getSubscribedMessage().should('be.visible');
    });

    suiteOnlyIt('guest should be able to subscribe with a not-yet-subscribed email on the homepage', (): void => {
      const email = `newsletter-fresh-${Date.now()}@example.com`;

      customerNewsletterPage.visitHomepage();
      customerNewsletterPage.subscribeOnHomepage(email);

      customerNewsletterPage.getSubscribedMessage().should('be.visible');
    });

    suiteOnlyIt('guest should not be able to subscribe with an already-subscribed email', (): void => {
      const email = `newsletter-dup-${Date.now()}@example.com`;

      customerNewsletterPage.visitHomepage();
      customerNewsletterPage.subscribeOnHomepage(email);
      customerNewsletterPage.getSubscribedMessage().should('be.visible');

      customerNewsletterPage.visitHomepage();
      customerNewsletterPage.subscribeOnHomepage(email);
      customerNewsletterPage.getAlreadySubscribedMessage().should('be.visible');
    });

    skipB2BIt('guest newsletter subscription should be linked to the customer after registration', (): void => {
      const email = `newsletter-link-${Date.now()}@example.com`;

      customerNewsletterPage.visitHomepage();
      customerNewsletterPage.subscribeOnHomepage(email);
      customerNewsletterPage.getSubscribedMessage().should('be.visible');

      loginPage.visit();
      const registeredCustomer = loginPage.register({ email });
      loginPage.assertBodyContainsText(loginPage.getRegistrationCompletedMessage());

      customerLoginScenario.execute({ email: registeredCustomer.email, password: registeredCustomer.password });

      customerOverviewPage.visit();
      customerOverviewPage.assertBodyContainsText(NEWSLETTER_SUBSCRIBED_LABEL).should('be.visible');
    });

    skipB2BIt('registered customer should be able to unsubscribe a linked newsletter subscription', (): void => {
      const email = `newsletter-unlink-${Date.now()}@example.com`;

      customerNewsletterPage.visitHomepage();
      customerNewsletterPage.subscribeOnHomepage(email);
      customerNewsletterPage.getSubscribedMessage().should('be.visible');

      loginPage.visit();
      const registeredCustomer = loginPage.register({ email });
      loginPage.assertBodyContainsText(loginPage.getRegistrationCompletedMessage());

      customerLoginScenario.execute({ email: registeredCustomer.email, password: registeredCustomer.password });

      customerOverviewPage.visit();
      customerOverviewPage.assertBodyContainsText(NEWSLETTER_SUBSCRIBED_LABEL).should('be.visible');

      customerNewsletterPage.visit();
      customerNewsletterPage.toggleAccountSubscriptionAndSubmit();

      customerNewsletterPage.getUnsubscribedMessage().should('be.visible');
      customerNewsletterPage.getAccountSubscriptionCheckboxInput().should('not.be.checked');
    });

    function skipB2BIt(description: string, testFn: () => void): void {
      (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
    }

    function suiteOnlyIt(description: string, testFn: () => void): void {
      (Cypress.env('repositoryId') === SUITE_REPOSITORY_ID ? it : it.skip)(description, testFn);
    }
  }
);
