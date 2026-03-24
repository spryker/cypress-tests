import { retryableBefore } from '../../../support/e2e';

/**
 * Yves: Product Attribute Visibility
 *
 * Flow:
 * 1. Login to BO, find attribute by key, set visibility to PDP+PLP+Cart, save
 * 2. Trigger publish & sync
 * 3. Verify badges on PLP, attributes on PDP, badges on Cart
 * 4. Edit attribute to remove PLP+Cart visibility, verify they disappear
 */
describe(
  'product attribute visibility on storefront',
  { tags: ['@yves', '@product-attribute', 'product-attribute', 'catalog', 'cart', 'spryker-core'] },
  (): void => {
    interface StaticFixtures {
      defaultPassword: string;
      attributeKey: string;
      attributeValue: string;
    }

    interface DynamicFixtures {
      rootUser: { username: string };
      customer: { email: string };
      product: {
        sku: string;
        abstract_sku: string;
        localized_attributes: Array<{ name: string }>;
      };
    }

    let staticFixtures: StaticFixtures;
    let dynamicFixtures: DynamicFixtures;

    const ATTRIBUTE_LIST_URL = '/product-attribute-gui/attribute';
    const CREATE_ATTRIBUTE_URL = '/product-attribute-gui/attribute/create';

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      loginToBackoffice();

      // Create the product management attribute with PDP+PLP+Cart visibility
      createOrUpdateAttribute(staticFixtures.attributeKey, ['PDP', 'PLP', 'Cart']);
      triggerPublishAndSync();

      // Verify product is searchable before running tests
      visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);
    });

    describe('PLP attribute badges', (): void => {
      it('should display attribute badges on product listing page', (): void => {
        visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);

        cy.get('[data-qa="component product-item"]')
          .first()
          .within(() => {
            cy.get('.badge.badge--hollow').should('exist');
            cy.get('.badge.badge--hollow').should('contain', staticFixtures.attributeValue);
          });
      });
    });

    describe('PDP attribute visibility', (): void => {
      it('should display PDP-visible attributes on product detail page', (): void => {
        visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);
        cy.get('[data-qa="component product-item"]').first().find('a').first().click();

        cy.get('[itemprop="additionalProperty"]').should('exist');
        cy.get('[itemprop="additionalProperty"]').should('contain', staticFixtures.attributeValue);
      });
    });

    describe('Cart attribute badges', (): void => {
      it('should display attribute badges on cart page', (): void => {
        // Cart is pre-populated via havePersistentQuote in dynamic fixtures
        loginToStorefront();
        cy.visit('/cart');

        cy.get('[data-qa="component product-cart-item"]')
          .first()
          .within(() => {
            cy.get('.badge.badge--hollow').should('exist');
            cy.get('.badge.badge--hollow').should('contain', staticFixtures.attributeValue);
          });
      });
    });

    describe('Removing visibility hides attributes', (): void => {
      before((): void => {
        // Remove PLP and Cart visibility, keep only PDP
        loginToBackoffice();
        createOrUpdateAttribute(staticFixtures.attributeKey, ['PDP']);
        triggerPublishAndSync();
      });

      it('should not show badges on PLP after removing PLP visibility', (): void => {
        visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);

        cy.get('[data-qa="component product-item"]')
          .first()
          .within(() => {
            cy.get('.badge.badge--hollow').should('not.exist');
          });
      });

      it('should still show attribute on PDP', (): void => {
        visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);
        cy.get('[data-qa="component product-item"]').first().find('a').first().click();

        cy.get('[itemprop="additionalProperty"]').should('exist');
        cy.get('[itemprop="additionalProperty"]').should('contain', staticFixtures.attributeValue);
      });

      it('should not show badges on cart page after removing Cart visibility', (): void => {
        loginToStorefront();
        cy.visit('/cart');

        cy.get('[data-qa="component product-cart-item"]')
          .first()
          .within(() => {
            cy.get('.badge.badge--hollow').should('not.exist');
          });
      });
    });

    describe('Removing PDP visibility hides attributes on PDP', (): void => {
      before((): void => {
        loginToBackoffice();
        createOrUpdateAttribute(staticFixtures.attributeKey, []);
        triggerPublishAndSync();
      });

      it('should not show attribute on PDP when visibility is removed', (): void => {
        visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);
        cy.get('[data-qa="component product-item"]').first().find('a').first().click();

        cy.get('[itemprop="additionalProperty"]').each(($el) => {
          cy.wrap($el).should('not.contain', staticFixtures.attributeValue);
        });
      });
    });

    function loginToBackoffice(): void {
      cy.session(['bo', dynamicFixtures.rootUser.username], () => {
        cy.visitBackoffice('/security-gui/login');
        cy.get('#auth_username').type(dynamicFixtures.rootUser.username);
        cy.get('#auth_password').type(staticFixtures.defaultPassword);
        cy.get('form[name=auth]').find('[type="submit"]').click();
        cy.url().should('not.include', '/login');
      });
    }

    function loginToStorefront(): void {
      cy.session(['yves', dynamicFixtures.customer.email], () => {
        cy.visit('/login');
        cy.get('[name="loginForm[email]"]').type(dynamicFixtures.customer.email);
        cy.get('[name="loginForm[password]"]').type(staticFixtures.defaultPassword);
        cy.get('form[name="loginForm"]').submit();
        cy.url().should('not.include', '/login');
      });
    }

    function visitSearchAndWaitForProduct(query: string): void {
      cy.reloadUntilFound(
        `/search?q=${query}`,
        '[data-qa="component product-item"]',
        'body',
        10,
        3000,
      );
    }

    function createOrUpdateAttribute(attributeKey: string, visibilityTypes: string[]): void {
      // Check if attribute already exists
      cy.intercept('GET', '**/product-attribute-gui/attribute/table**').as('attrTableLoad');
      cy.visitBackoffice(ATTRIBUTE_LIST_URL);
      cy.wait('@attrTableLoad');

      cy.intercept('GET', '**/product-attribute-gui/attribute/table**').as('attrTableSearch');
      cy.get('input[type="search"][data-qa="table-search"]')
        .should('be.visible')
        .clear()
        .type(attributeKey);
      cy.wait('@attrTableSearch');

      cy.get('.dataTable tbody tr').first().then(($row) => {
        if ($row.text().includes('No matching records found')) {
          // Create new attribute
          createAttribute(attributeKey, visibilityTypes);
        } else {
          // Edit existing attribute
          cy.wrap($row).contains('Edit').click();
          cy.get('#attributeForm_visibility_types').invoke('val', visibilityTypes).trigger('change', { force: true });
          cy.get('input[type="submit"].safe-submit').click();
          cy.url().should('contain', '/translate');
        }
      });
    }

    function createAttribute(key: string, visibilityTypes: string[]): void {
      cy.visitBackoffice(CREATE_ATTRIBUTE_URL);

      cy.get('#attributeForm_key').clear().type(key);
      cy.get('#attributeForm_input_type').select('text');
      cy.get('#attributeForm_allow_input').check();

      cy.get('#attributeForm_visibility_types').invoke('val', visibilityTypes).trigger('change', { force: true });

      cy.get('input[type="submit"].safe-submit').click();
      cy.url().should('contain', '/translate');
    }

    function triggerPublishAndSync(): void {
      cy.runQueueWorker();
    }
  },
);
