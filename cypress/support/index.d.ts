// cypress/support/index.d.ts

import type CheckoutFixtures from '../fixtures/checkout.json';
import type CommentFixtures from '../fixtures/comment.suite.json';
import type OrderFixtures from '../fixtures/order.json';
import type ReturnFixtures from '../fixtures/return.json';
import type BackofficeMerchantAgentFixtures from '../fixtures/backoffice-merchant-agent.suite.json';

interface FixtureTypes {
  checkoutFixtures: typeof CheckoutFixtures;
  commentFixtures: typeof CommentFixtures;
  orderFixtures: typeof OrderFixtures;
  returnFixtures: typeof ReturnFixtures;
  backofficeMerchantAgentFixtures: typeof BackofficeMerchantAgentFixtures;
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * @example cy.iframe()
       */
      iframe(): Chainable<Element>;

      /**
       * @example cy.reloadUntilFound('/transactions', 'td:contains($4.44)')
       */
      reloadUntilFound(
        url: string,
        findSelector: string,
        getSelector: string,
        retries: number,
        retryWait: number
      ): void;

      /**
       * @example cy.resetCookies()
       */
      resetCookies(): void;

      /**
       * @example cy.resetBackofficeCookies()
       */
      resetBackofficeCookies(): void;

      /**
       * @example cy.visitBackoffice('/security-gui/login')
       */
      visitBackoffice(url: string): Chainable<Element>;

      fixture<K extends keyof FixtureTypes>(
        fixtureName: K
      ): Chainable<FixtureTypes[K]>;
    }
  }
}

type CheckoutFixture = {
  concreteProductSkus: string[];
  customer: Customer;
};

type CommentFixture = {
  concreteProductSku: string;
  comments: string[];
  customer: Customer;
};

type OrderFixtures = {
  concreteProductSkus: string[];
  customer: Customer;
};

type ReturnFixtures = {
  concreteProductSkus: string[];
  user: User;
};

type BackofficeMerchantAgentFixtures = {
  user: User;
  merchantAgent: User;
  customerAgent: User;
};

type Customer = {
  email: string;
  password: string;
};

type User = {
  email: string;
  password: string;
};
