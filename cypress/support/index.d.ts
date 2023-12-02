// cypress/support/index.d.ts

import type CheckoutFixtures from '../fixtures/checkout.json';
import type CommentFixtures from '../fixtures/comment.json';
import type OrderFixtures from '../fixtures/order.json';
import type ReturnFixtures from '../fixtures/return.json';

interface FixtureTypes {
  checkoutFixtures: typeof CheckoutFixtures;
  commentFixtures: typeof CommentFixtures;
  orderFixtures: typeof OrderFixtures;
  returnFixtures: typeof ReturnFixtures;
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
      ): Chainable<Element>;

      /**
       * @example cy.resetCookies()
       */
      resetCookies(): Chainable<Element>;

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

interface CheckoutFixture {
  concreteProductSkus: string[];
  customer: Customer;
}

interface CommentFixture {
  concreteProductSku: string;
  comments: string[];
  customer: Customer;
}

interface OrderFixtures {
  concreteProductSkus: string[];
  customer: Customer;
}

interface ReturnFixtures {
  concreteProductSkus: string[];
  user: User;
}

interface Customer {
  email: string;
  password: string;
}

interface User {
  email: string;
  password: string;
}
