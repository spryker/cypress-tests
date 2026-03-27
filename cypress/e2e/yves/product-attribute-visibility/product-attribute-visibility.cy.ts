import { retryableBefore } from '../../../support/e2e';

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

      loginToBackoffice();
      updateAttributeVisibility(staticFixtures.attributeKey, ['PDP', 'PLP', 'Cart']);
      triggerPublishAndSync();

      visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);
    });

    describe('PLP attribute badges', (): void => {
      it('should display attribute badges on product listing page', (): void => {
        visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);

        cy.get('[data-qa="component product-item"]')
          .first()
          .within(() => {
            cy.get('.badge.badge--hollow').should('contain', staticFixtures.attributeValue);
          });
      });
    });

    describe('PDP attribute visibility', (): void => {
      it('should display PDP-visible attributes on product detail page', (): void => {
        navigateToProductDetailPage();

        cy.get('[itemprop="additionalProperty"]').should('contain', staticFixtures.attributeValue);
      });
    });

    describe('Cart attribute badges', (): void => {
      it('should display attribute badges on cart page', (): void => {
        loginToStorefront();
        cy.visit('/cart');

        cy.get('[data-qa="component product-cart-item"]')
          .first()
          .within(() => {
            cy.get('.badge.badge--hollow').should('contain', staticFixtures.attributeValue);
          });
      });
    });

    describe('Removing PLP and Cart visibility', (): void => {
      retryableBefore((): void => {
        loginToBackoffice();
        updateAttributeVisibility(staticFixtures.attributeKey, ['PDP']);
        triggerPublishAndSync();
      });

      it('should not show attribute badge on PLP', (): void => {
        visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);

        cy.get('[data-qa="component product-item"]').first().should('not.contain', staticFixtures.attributeValue);
      });

      it('should still show attribute on PDP', (): void => {
        navigateToProductDetailPage();

        cy.get('[itemprop="additionalProperty"]').should('contain', staticFixtures.attributeValue);
      });

      it('should not show attribute badge on cart page', (): void => {
        loginToStorefront();
        cy.visit('/cart');

        cy.get('[data-qa="component product-cart-item"]').first().should('not.contain', staticFixtures.attributeValue);
      });
    });

    describe('Removing all visibility', (): void => {
      retryableBefore((): void => {
        loginToBackoffice();
        updateAttributeVisibility(staticFixtures.attributeKey, []);
        triggerPublishAndSync();
      });

      it('should not show attribute on PDP', (): void => {
        navigateToProductDetailPage();

        cy.get('[itemprop="additionalProperty"]').should('not.contain', staticFixtures.attributeValue);
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
      cy.reloadUntilFound(`/search?q=${query}`, '[data-qa="component product-item"]', 'body', 3, 1000);
    }

    function navigateToProductDetailPage(): void {
      visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);
      cy.get('[data-qa="component product-item"]').first().find('a').first().click();
      cy.url().should('not.include', '/search');
    }

    function updateAttributeVisibility(attributeKey: string, visibilityTypes: string[]): void {
      searchAttributeInTable(attributeKey);
      cy.get('.dataTable tbody tr').first().contains('Edit').click();
      setVisibilityAndSave(visibilityTypes);
    }

    function searchAttributeInTable(attributeKey: string): void {
      cy.visitBackoffice(ATTRIBUTE_LIST_URL);

      cy.get('.dataTable tbody tr').should('be.visible');
      cy.get('input[type="search"][data-qa="table-search"]').should('be.visible').type(`{selectall}${attributeKey}`);

      cy.get('.dataTable tbody').should(($tbody) => {
        const text = $tbody.text();
        expect(text.includes(attributeKey)).to.be.true;
      });
    }

    function setVisibilityAndSave(visibilityTypes: string[]): void {
      cy.get('#attributeForm_visibility_types').invoke('val', visibilityTypes).trigger('change', { force: true });
      cy.get('input[type="submit"].safe-submit').click();
      cy.url().should('contain', '/translate');
    }

    function triggerPublishAndSync(): void {
      cy.runQueueWorker();
    }
  }
);
