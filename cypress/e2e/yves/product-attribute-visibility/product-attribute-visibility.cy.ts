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

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      // Login to BO and set attribute visibility to PDP+PLP+Cart
      loginToBackoffice();
      setAttributeVisibility(staticFixtures.attributeKey, ['PDP', 'PLP', 'Cart']);
      triggerPublishAndSync();
    });

    describe('PLP attribute badges', (): void => {
      it('should display attribute badges on product listing page', (): void => {
        cy.visit(`/search?q=${dynamicFixtures.product.abstract_sku}`);

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
        cy.visit(`/search?q=${dynamicFixtures.product.abstract_sku}`);
        cy.get('[data-qa="component product-item"] a').first().click();

        cy.get('[itemprop="additionalProperty"]').should('exist');
        cy.get('[itemprop="additionalProperty"]').should('contain', staticFixtures.attributeValue);
      });
    });

    describe('Cart attribute badges', (): void => {
      before((): void => {
        loginToStorefront();

        // Add product to cart
        cy.visit(`/search?q=${dynamicFixtures.product.sku}`);
        cy.get('[data-qa="component product-item"] a').first().click();
        cy.get('[data-qa="add-to-cart-button"]').click();
      });

      it('should display attribute badges on cart page', (): void => {
        cy.visit('/cart');

        cy.get('[data-qa="component product-cart-item"]')
          .first()
          .within(() => {
            cy.get('.badge.badge--hollow').should('exist');
            cy.get('.badge.badge--hollow').should('contain', staticFixtures.attributeValue);
          });
      });
    });

    describe('removing visibility hides attributes', (): void => {
      before((): void => {
        // Remove PLP and Cart visibility, keep only PDP
        loginToBackoffice();
        setAttributeVisibility(staticFixtures.attributeKey, ['PDP']);
        triggerPublishAndSync();
      });

      it('should not show badges on PLP after removing PLP visibility', (): void => {
        cy.visit(`/search?q=${dynamicFixtures.product.abstract_sku}`);

        cy.get('[data-qa="component product-item"]')
          .first()
          .within(() => {
            cy.get('.badge.badge--hollow').should('not.exist');
          });
      });

      it('should still show attribute on PDP', (): void => {
        cy.visit(`/search?q=${dynamicFixtures.product.abstract_sku}`);
        cy.get('[data-qa="component product-item"] a').first().click();

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

    function setAttributeVisibility(attributeKey: string, visibilityTypes: string[]): void {
      // Navigate to attribute list and find the attribute
      cy.visitBackoffice(ATTRIBUTE_LIST_URL);
      cy.get('input[type="search"]').clear().type(attributeKey);
      cy.get('table tbody tr').first().contains('Edit').click();

      // Clear existing Select2 selections
      cy.get('#attributeForm_visibility_types')
        .siblings('.select2-container')
        .find('.select2-selection__choice__remove')
        .each(($btn) => {
          cy.wrap($btn).click();
        });

      // Select new visibility types via Select2
      visibilityTypes.forEach((type) => {
        cy.get('#attributeForm_visibility_types')
          .siblings('.select2-container')
          .click();

        cy.get('.select2-results__option').contains(type).click();
      });

      // Submit the form
      cy.get('form[name="attributeForm"]').submit();
      cy.contains('Attribute was successfully updated');
    }

    function triggerPublishAndSync(): void {
      cy.runQueueWorker();
    }
  },
);
