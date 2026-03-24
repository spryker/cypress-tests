import { retryableBefore } from '../../../support/e2e';

describe(
  'product attribute visibility in backoffice',
  { tags: ['@backoffice', '@product-attribute', 'product-attribute', 'spryker-core'] },
  (): void => {
    const ATTRIBUTE_LIST_URL = '/product-attribute-gui/attribute';
    const TABLE_AJAX_URL = '**/product-attribute-gui/attribute/table**';
    const CREATE_ATTRIBUTE_URL = '/product-attribute-gui/attribute/create';

    interface StaticFixtures {
      defaultPassword: string;
    }

    interface DynamicFixtures {
      rootUser: { username: string };
    }

    let staticFixtures: StaticFixtures;
    let dynamicFixtures: DynamicFixtures;

    const uid = Math.random().toString(36).substring(2, 8);
    const attributes = {
      none: { key: `cy_vis_none_${uid}`, visibilityTypes: [] as string[] },
      pdp: { key: `cy_vis_pdp_${uid}`, visibilityTypes: ['PDP'] },
      plp: { key: `cy_vis_plp_${uid}`, visibilityTypes: ['PLP'] },
      cart: { key: `cy_vis_cart_${uid}`, visibilityTypes: ['Cart'] },
      combined: { key: `cy_vis_all_${uid}`, visibilityTypes: ['PDP', 'PLP', 'Cart'] },
    };

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      loginToBackoffice();

      Object.values(attributes).forEach((attr) => {
        createAttribute(attr.key, attr.visibilityTypes);
      });
    });

    beforeEach((): void => {
      loginToBackoffice();
    });

    it('attribute list table should contain Display At column', (): void => {
      visitAttributeListAndWaitForTable();

      cy.get('table thead').should('contain', 'Display At');
    });

    it('attribute list should have Display At filter dropdown', (): void => {
      visitAttributeListAndWaitForTable();

      cy.get('#table_filter_form_visibilityTypes').should('exist');
    });

    it('filtering by PDP should find PDP attribute', (): void => {
      applyFilterAndSearch(attributes.pdp.key, 'PDP');

      assertSingleRow();
      cy.get('.dataTable tbody tr').first().find('td').eq(4).should('contain', 'PDP');
    });

    it('filtering by PLP should find PLP attribute', (): void => {
      applyFilterAndSearch(attributes.plp.key, 'PLP');

      assertSingleRow();
      cy.get('.dataTable tbody tr').first().find('td').eq(4).should('contain', 'PLP');
    });

    it('filtering by Cart should find Cart attribute', (): void => {
      applyFilterAndSearch(attributes.cart.key, 'Cart');

      assertSingleRow();
      cy.get('.dataTable tbody tr').first().find('td').eq(4).should('contain', 'Cart');
    });

    it('filtering by None should find attribute without visibility', (): void => {
      applyFilterAndSearch(attributes.none.key, 'None');

      assertSingleRow();
      cy.get('.dataTable tbody tr').first().find('td').eq(4).invoke('text').then((text) => {
        expect(text.trim()).to.equal('');
      });
    });

    it('combined attribute should appear in PDP filter with all visibility labels', (): void => {
      applyFilterAndSearch(attributes.combined.key, 'PDP');

      assertSingleRow();
      cy.get('.dataTable tbody tr').first().find('td').eq(4).should('contain', 'PDP');
      cy.get('.dataTable tbody tr').first().find('td').eq(4).should('contain', 'PLP');
      cy.get('.dataTable tbody tr').first().find('td').eq(4).should('contain', 'Cart');
    });

    it('combined attribute should appear in PLP filter', (): void => {
      applyFilterAndSearch(attributes.combined.key, 'PLP');

      assertSingleRow();
    });

    it('combined attribute should appear in Cart filter', (): void => {
      applyFilterAndSearch(attributes.combined.key, 'Cart');

      assertSingleRow();
    });

    it('PDP attribute should not appear in Cart filter', (): void => {
      applyFilterAndSearch(attributes.pdp.key, 'Cart');

      assertNoRecords();
    });

    function loginToBackoffice(): void {
      cy.session([dynamicFixtures.rootUser.username, staticFixtures.defaultPassword], () => {
        cy.visitBackoffice('/security-gui/login');
        cy.get('#auth_username').type(dynamicFixtures.rootUser.username);
        cy.get('#auth_password').type(staticFixtures.defaultPassword);
        cy.get('form[name=auth]').find('[type="submit"]').click();
        cy.url().should('not.include', '/login');
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

    function visitAttributeListAndWaitForTable(): void {
      cy.intercept('GET', TABLE_AJAX_URL).as('tableLoad');
      cy.visitBackoffice(ATTRIBUTE_LIST_URL);
      cy.wait('@tableLoad');
    }

    function applyFilterAndSearch(attributeKey: string, visibilityType: string): void {
      visitAttributeListAndWaitForTable();

      cy.get('#table_filter_form_visibilityTypes')
        .siblings('.select2-container')
        .click();
      cy.get('.select2-results__option').contains(visibilityType).click();

      cy.intercept('GET', TABLE_AJAX_URL).as('tableFilterLoad');
      cy.get('#product-attribute-gui-filter-form button').click();
      cy.wait('@tableFilterLoad');

      cy.intercept('GET', TABLE_AJAX_URL).as('tableSearchLoad');
      cy.get('input[type="search"][data-qa="table-search"]')
        .should('be.visible')
        .clear()
        .type(attributeKey);
      cy.wait('@tableSearchLoad');
    }

    function assertSingleRow(): void {
      cy.get('.dataTable tbody tr').should('have.length', 1);
    }

    function assertNoRecords(): void {
      cy.get('.dataTable tbody tr').should('have.length', 1);
      cy.get('.dataTable tbody tr').first().should('contain', 'No matching records found');
    }
  },
);
