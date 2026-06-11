import {
  ShoppingListConfigurableProductDynamicFixtures,
  ShoppingListConfigurableProductStaticFixtures,
} from '@interfaces/api';
import { applyPriceOverrides, authHeaders, expectApiErrorDetail, expectApiValidationError } from '@utils';
import { retryableBefore } from '../../../support/e2e';

interface ConfigurableItemOptions {
  quantity?: unknown;
  availableQuantity?: unknown;
  omitAvailableQuantity?: boolean;
  isComplete?: unknown;
  omitIsComplete?: boolean;
  netAmount?: unknown;
  grossAmount?: unknown;
  omitPrice?: boolean;
  displayData?: string;
  configuration?: string;
}

describe(
  'shopping list items configurable product',
  { tags: ['@api', '@shopping-list', 'product-configuration', 'configurable-product'] },
  (): void => {
    let staticFixtures: ShoppingListConfigurableProductStaticFixtures;
    let dynamicFixtures: ShoppingListConfigurableProductDynamicFixtures;
    let accessToken: string;
    let shoppingListId: string;

    retryableBefore((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      cy.getCustomerAccessToken(dynamicFixtures.customer.email, staticFixtures.defaultPassword).then((token) => {
        accessToken = token;

        cy.createShoppingList(accessToken, `${staticFixtures.shoppingListName}-${Date.now()}`).then((id) => {
          shoppingListId = id;
        });
      });
    });

    it('should add a configurable product to the shopping list', (): void => {
      addConfigurableItem({ quantity: staticFixtures.quantity }).then((response) => {
        expect(response.status).to.eq(201);
        const itemId = response.body.data.id;
        expect(response.body.data.attributes.quantity).to.eq(staticFixtures.quantity);
        expect(response.body.data.attributes.sku).to.eq(dynamicFixtures.configurableProduct.sku);
        expect(response.body.data.attributes.productConfigurationInstance.displayData).to.eq(staticFixtures.displayData);
        expect(response.body.data.attributes.productConfigurationInstance.isComplete).to.eq(true);

        cy.request({
          method: 'GET',
          url: `${Cypress.env().glueUrl}/shopping-lists/${shoppingListId}?include=shopping-list-items,concrete-products`,
          headers: authHeaders(accessToken),
        }).then((listResponse) => {
          expect(listResponse.status).to.eq(200);
          expect(listResponse.body.data.type).to.eq('shopping-lists');
          expect(listResponse.body.data.id).to.eq(shoppingListId);
          expect(listResponse.body.data.attributes.numberOfItems).to.eq(staticFixtures.quantity);
          expect(listResponse.body.data.relationships['shopping-list-items'].data[0].id).to.eq(itemId);
          expect(listResponse.body.included).to.have.length(2);
          const itemInclude = listResponse.body.included.find(
            (entity: { type: string }) => entity.type === 'shopping-list-items'
          );
          expect(itemInclude.id).to.eq(itemId);
          expect(itemInclude.attributes.productConfigurationInstance.isComplete).to.eq(true);
          expect(itemInclude.attributes.productConfigurationInstance.displayData).to.eq(staticFixtures.displayData);
        });
      });
    });

    it('should update the quantity of a configurable product in the shopping list', (): void => {
      addConfigurableItem({ quantity: staticFixtures.quantity }).then((addResponse) => {
        const itemId = addResponse.body.data.id;

        cy.request({
          method: 'PATCH',
          url: `${Cypress.env().glueUrl}/shopping-lists/${shoppingListId}/shopping-list-items/${itemId}`,
          headers: authHeaders(accessToken),
          body: { data: { type: 'shopping-list-items', attributes: { quantity: 2 } } },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.data.attributes.quantity).to.eq(2);
        });
      });
    });

    it('should update the configuration of a configurable product in the shopping list', (): void => {
      addConfigurableItem({ quantity: staticFixtures.quantity }).then((addResponse) => {
        const itemId = addResponse.body.data.id;
        const updatedDisplayData = '{"Preferred time of the day":"Morning","Date":"10.10.2040"}';

        cy.request({
          method: 'PATCH',
          url: `${Cypress.env().glueUrl}/shopping-lists/${shoppingListId}/shopping-list-items/${itemId}`,
          headers: authHeaders(accessToken),
          body: buildItemBody({ quantity: staticFixtures.quantity, displayData: updatedDisplayData }),
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.data.attributes.productConfigurationInstance.displayData).to.eq(updatedDisplayData);
        });
      });
    });

    it('should remove a configurable product from the shopping list', (): void => {
      addConfigurableItem({ quantity: staticFixtures.quantity }).then((addResponse) => {
        const itemId = addResponse.body.data.id;

        cy.request({
          method: 'DELETE',
          url: `${Cypress.env().glueUrl}/shopping-lists/${shoppingListId}/shopping-list-items/${itemId}`,
          headers: authHeaders(accessToken),
        }).then((response) => {
          expect(response.status).to.eq(204);

          cy.request({
            method: 'GET',
            url: `${Cypress.env().glueUrl}/shopping-lists/${shoppingListId}`,
            headers: authHeaders(accessToken),
          }).then((listResponse) => {
            expect(listResponse.status).to.eq(200);
            expect(listResponse.body.data.attributes.numberOfItems).to.eq(0);
          });
        });
      });
    });

    it('should add two configurable products with different configurations to the shopping list', (): void => {
      addConfigurableItem({ quantity: staticFixtures.quantity }).then((firstResponse) => {
        expect(firstResponse.status).to.eq(201);
        const firstItemId = firstResponse.body.data.id;

        addConfigurableItem({
          quantity: staticFixtures.quantity,
          configuration: '{"time_of_day":"5"}',
          displayData: '{"Preferred time of the day":"Evening","Date":"01.01.2060"}',
        }).then((secondResponse) => {
          expect(secondResponse.status).to.eq(201);
          expect(secondResponse.body.data.id).to.not.eq(firstItemId);

          getList().then((listResponse) => {
            expect(listResponse.status).to.eq(200);
            expect(listResponse.body.data.relationships['shopping-list-items'].data).to.have.length(2);
          });
        });
      });
    });

    it('should add a configurable product and a regular product to the shopping list', (): void => {
      addConfigurableItem({ quantity: staticFixtures.quantity }).then((configResponse) => {
        expect(configResponse.status).to.eq(201);

        addRegularItem(1).then((regularResponse) => {
          expect(regularResponse.status).to.eq(201);

          getList().then((listResponse) => {
            expect(listResponse.status).to.eq(200);
            expect(listResponse.body.data.relationships['shopping-list-items'].data).to.have.length(2);
          });
        });
      });
    });

    it('should remove a configurable product and leave a regular product in the shopping list', (): void => {
      addConfigurableItem({ quantity: staticFixtures.quantity }).then((configResponse) => {
        const configItemId = configResponse.body.data.id;

        addRegularItem(1).then((regularResponse) => {
          const regularItemId = regularResponse.body.data.id;

          cy.request({
            method: 'DELETE',
            url: `${Cypress.env().glueUrl}/shopping-lists/${shoppingListId}/shopping-list-items/${configItemId}`,
            headers: authHeaders(accessToken),
          }).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(204);

            getList().then((listResponse) => {
              const items = listResponse.body.data.relationships['shopping-list-items'].data;
              expect(items).to.have.length(1);
              expect(items[0].id).to.eq(regularItemId);
            });
          });
        });
      });
    });

    const quantityValidations = [
      { description: 'zero quantity', quantity: '0', detail: 'quantity => This value should be greater than 0.' },
      { description: 'negative quantity', quantity: '-1', detail: 'quantity => This value should be greater than 0.' },
      { description: 'string quantity', quantity: 'string', detail: 'quantity => This value should be of type integer.' },
      { description: 'empty quantity', quantity: '', detail: 'quantity => This value should not be blank.' },
      { description: 'missing quantity', quantity: undefined, detail: 'quantity => This field is missing.' },
    ];

    quantityValidations.forEach(({ description, quantity, detail }): void => {
      it(`should not add a configurable product to the shopping list with ${description}`, (): void => {
        addConfigurableItem({ quantity }, false).then((response) => {
          expectApiValidationError(response, detail);
        });
      });
    });

    const availableQuantityValidations = [
      {
        description: 'empty availableQuantity',
        options: { availableQuantity: '' },
        details: [
          'productConfigurationInstance.availableQuantity => This value should not be blank.',
          'productConfigurationInstance.availableQuantity => This value should be of type numeric.',
        ],
      },
      {
        description: 'string availableQuantity',
        options: { availableQuantity: 'string' },
        details: ['productConfigurationInstance.availableQuantity => This value should be of type numeric.'],
      },
      {
        description: 'missing availableQuantity',
        options: { omitAvailableQuantity: true },
        details: ['productConfigurationInstance.availableQuantity => This field is missing.'],
      },
    ];

    availableQuantityValidations.forEach(({ description, options, details }): void => {
      it(`should not add a configurable product to the shopping list with ${description}`, (): void => {
        addConfigurableItem({ quantity: staticFixtures.quantity, ...options }, false).then((response) => {
          expectApiValidationError(response, details[0]);
          details.slice(1).forEach((detail) => expectApiErrorDetail(response, detail));
        });
      });
    });

    const isCompleteValidations = [
      {
        description: 'numeric isComplete',
        options: { isComplete: 1 },
        detail: 'productConfigurationInstance.isComplete => This value should be of type boolean.',
      },
      {
        description: 'string isComplete',
        options: { isComplete: 'string' },
        detail: 'productConfigurationInstance.isComplete => This value should be of type boolean.',
      },
      {
        description: 'missing isComplete',
        options: { omitIsComplete: true },
        detail: 'productConfigurationInstance.isComplete => This field is missing.',
      },
    ];

    isCompleteValidations.forEach(({ description, options, detail }): void => {
      it(`should not add a configurable product to the shopping list with ${description}`, (): void => {
        addConfigurableItem({ quantity: staticFixtures.quantity, ...options }, false).then((response) => {
          expectApiValidationError(response, detail);
        });
      });
    });

    const priceValidations = [
      {
        description: 'negative price',
        options: { netAmount: -23434, grossAmount: -42502 },
        details: [
          'productConfigurationInstance.prices.0.netAmount => This value should be greater than or equal to 0.',
          'productConfigurationInstance.prices.0.grossAmount => This value should be greater than or equal to 0.',
        ],
      },
      {
        description: 'empty price',
        options: { netAmount: '', grossAmount: '' },
        details: [
          'productConfigurationInstance.prices.0.netAmount => This value should not be blank.',
          'productConfigurationInstance.prices.0.grossAmount => This value should not be blank.',
        ],
      },
      {
        description: 'missing price',
        options: { omitPrice: true },
        details: ['productConfigurationInstance.prices.0.netAmount => This field is missing.'],
      },
    ];

    priceValidations.forEach(({ description, options, details }): void => {
      it(`should not add a configurable product to the shopping list with ${description}`, (): void => {
        addConfigurableItem({ quantity: staticFixtures.quantity, ...options }, false).then((response) => {
          expectApiValidationError(response, details[0]);
          details.slice(1).forEach((detail) => expectApiErrorDetail(response, detail));
        });
      });
    });

    function addConfigurableItem(options: ConfigurableItemOptions, failOnStatusCode = true): Cypress.Chainable {
      return cy.request({
        method: 'POST',
        url: `${Cypress.env().glueUrl}/shopping-lists/${shoppingListId}/shopping-list-items`,
        headers: authHeaders(accessToken),
        failOnStatusCode,
        body: buildItemBody(options),
      });
    }

    function addRegularItem(quantity: number): Cypress.Chainable {
      return cy.request({
        method: 'POST',
        url: `${Cypress.env().glueUrl}/shopping-lists/${shoppingListId}/shopping-list-items`,
        headers: authHeaders(accessToken),
        body: { data: { type: 'shopping-list-items', attributes: { sku: dynamicFixtures.regularProduct.sku, quantity } } },
      });
    }

    function getList(): Cypress.Chainable {
      return cy.request({
        method: 'GET',
        url: `${Cypress.env().glueUrl}/shopping-lists/${shoppingListId}?include=shopping-list-items`,
        headers: authHeaders(accessToken),
      });
    }

    function buildItemBody(options: ConfigurableItemOptions): Record<string, unknown> {
      const price = applyPriceOverrides(staticFixtures.prices[0] as unknown as Record<string, unknown>, options);

      const productConfigurationInstance: Record<string, unknown> = {
        displayData: options.displayData ?? staticFixtures.displayData,
        configuration: options.configuration ?? staticFixtures.configuration,
        configuratorKey: staticFixtures.configuratorKey,
        quantity: staticFixtures.quantity,
        prices: [price],
      };
      if (!options.omitAvailableQuantity) {
        productConfigurationInstance.availableQuantity = options.availableQuantity ?? staticFixtures.availableQuantity;
      }
      if (!options.omitIsComplete) {
        productConfigurationInstance.isComplete = options.isComplete ?? true;
      }

      const attributes: Record<string, unknown> = {
        sku: dynamicFixtures.configurableProduct.sku,
        productConfigurationInstance,
      };
      if (!('quantity' in options) || options.quantity !== undefined) {
        attributes.quantity = options.quantity;
      }

      return { data: { type: 'shopping-list-items', attributes } };
    }
  }
);
