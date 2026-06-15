import { CartConfigurableProductDynamicFixtures, CartConfigurableProductStaticFixtures } from '@interfaces/api';
import {
  addCartItem,
  applyPriceOverrides,
  buildProductConfigurationInstance,
  deleteCartItem,
  expectApiErrorDetail,
  expectApiValidationError,
  getCart,
  updateCartItem,
} from '@utils';
import { retryableBefore } from '../../../support/e2e';

interface ConfigurableItemOptions {
  quantity: unknown;
  netAmount?: unknown;
  grossAmount?: unknown;
  isComplete?: boolean;
  omitIsComplete?: boolean;
}

describe(
  'cart items configurable product',
  { tags: ['@api', '@cart', 'configurable-product'] },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for b2b-mp', () => {});
      return;
    }

    let staticFixtures: CartConfigurableProductStaticFixtures;
    let dynamicFixtures: CartConfigurableProductDynamicFixtures;
    let accessToken: string;
    let cartId: string;

    retryableBefore((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      cy.getCustomerAccessToken(dynamicFixtures.customer.email, staticFixtures.defaultPassword).then((token) => {
        accessToken = token;

        cy.createCart(accessToken, {
          name: 'Configurable product cart',
          priceMode: staticFixtures.priceMode,
          currency: staticFixtures.currency,
          store: staticFixtures.store,
        }).then((id) => {
          cartId = id;
        });
      });
    });

    it('should add a configurable product to the cart', (): void => {
      postConfigurableItem({ quantity: staticFixtures.quantity }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.data.id).to.eq(cartId);

        const item = response.body.included[0];
        expect(item.attributes.sku).to.eq(dynamicFixtures.configurableProduct.sku);
        expect(item.attributes.quantity).to.eq(staticFixtures.quantity);
        expect(item.attributes.productConfigurationInstance.displayData).to.eq(staticFixtures.displayData);
        expect(item.attributes.productConfigurationInstance.isComplete).to.eq(true);
      });
    });

    it('should update configuration and quantity of a configurable product in the cart', (): void => {
      postConfigurableItem({ quantity: 3, isComplete: false }).then((addResponse) => {
        expect(addResponse.status).to.eq(201);
        const item = addResponse.body.included[0];
        const itemUid = item.id;
        expect(item.attributes.sku).to.eq(dynamicFixtures.configurableProduct.sku);
        expect(item.attributes.quantity).to.eq(3);
        expect(item.attributes.productConfigurationInstance.displayData).to.eq(staticFixtures.displayData);
        expect(item.attributes.productConfigurationInstance.isComplete).to.eq(false);
        expect(item.attributes.productConfigurationInstance.configuration).to.eq(staticFixtures.configuration);

        updateCartItem(accessToken, cartId, itemUid, buildItemBody({ quantity: 2, isComplete: false })).then(
          (response) => {
          expect(response.status).to.eq(200);
          expect(response.body.data.id).to.eq(cartId);
          expect(response.body.data.type).to.eq('carts');
          expect(response.body.data.links.self).to.not.be.empty;

          const updatedItem = response.body.included[0];
          expect(updatedItem.id).to.eq(itemUid);
          expect(updatedItem.attributes.quantity).to.eq(2);
          // amount-based total is product/discount specific in robot; here we assert it stays a positive number.
          expect(updatedItem.attributes.calculations.sumPriceToPayAggregation)
            .to.be.a('number')
            .and.to.be.greaterThan(0);
        });
      });
    });

    it('should delete a configurable product item from the cart', (): void => {
      postConfigurableItem({ quantity: 3 }).then((addResponse) => {
        const itemUid = addResponse.body.included[0].id;

        deleteCartItem(accessToken, cartId, itemUid).then((response) => {
          expect(response.status).to.eq(204);

          getCart(accessToken, cartId).then((cartResponse) => {
            expect(cartResponse.status).to.eq(200);
            expect(cartResponse.body.data.attributes.totals.grandTotal).to.eq(0);
          });
        });
      });
    });

    const quantityValidations = [
      { description: 'empty quantity', quantity: '', detail: 'quantity => This value should not be blank.' },
      { description: '0 quantity', quantity: '0', detail: 'quantity => This value should be greater than 0.' },
      { description: 'negative quantity', quantity: '-1', detail: 'quantity => This value should be greater than 0.' },
    ];

    quantityValidations.forEach(({ description, quantity, detail }): void => {
      it(`should not add a configurable product to the cart with ${description}`, (): void => {
        postConfigurableItem({ quantity }, false).then((response) => {
          expectApiValidationError(response, detail);
          expectCartIsEmpty();
        });
      });
    });

    const priceValidations = [
      {
        description: 'negative price',
        netAmount: -23434,
        grossAmount: -42502,
        netDetail:
          'productConfigurationInstance.prices.0.netAmount => This value should be greater than or equal to 0.',
        grossDetail:
          'productConfigurationInstance.prices.0.grossAmount => This value should be greater than or equal to 0.',
      },
      {
        description: 'empty price',
        netAmount: '',
        grossAmount: '',
        netDetail: 'productConfigurationInstance.prices.0.netAmount => This value should not be blank.',
        grossDetail: 'productConfigurationInstance.prices.0.grossAmount => This value should not be blank.',
      },
    ];

    priceValidations.forEach(({ description, netAmount, grossAmount, netDetail, grossDetail }): void => {
      it(`should not add a configurable product to the cart with ${description}`, (): void => {
        postConfigurableItem({ quantity: '1', netAmount, grossAmount }, false).then((response) => {
          expectApiValidationError(response, netDetail);
          expectApiErrorDetail(response, grossDetail);
          expectCartIsEmpty();
        });
      });
    });

    it('should not add a configurable product to the cart with missing isComplete', (): void => {
      postConfigurableItem({ quantity: '1', omitIsComplete: true }, false).then((response) => {
        expectApiValidationError(response, 'productConfigurationInstance.isComplete => This field is missing.');
        expectCartIsEmpty();
      });
    });

    function postConfigurableItem(options: ConfigurableItemOptions, failOnStatusCode = true): Cypress.Chainable {
      return addCartItem(accessToken, cartId, buildItemBody(options), failOnStatusCode);
    }

    function buildItemBody(options: ConfigurableItemOptions): Record<string, unknown> {
      const price = applyPriceOverrides(staticFixtures.prices[0] as unknown as Record<string, unknown>, options);

      const isComplete = options.omitIsComplete ? null : (options.isComplete ?? true);
      const productConfigurationInstance = buildProductConfigurationInstance(
        {
          displayData: staticFixtures.displayData,
          configuration: staticFixtures.configuration,
          configuratorKey: staticFixtures.configuratorKey,
          quantity: staticFixtures.quantity,
          availableQuantity: staticFixtures.availableQuantity,
          prices: [price],
        },
        isComplete
      );

      return {
        data: {
          type: 'items',
          attributes: {
            sku: dynamicFixtures.configurableProduct.sku,
            quantity: options.quantity,
            productConfigurationInstance,
          },
        },
      };
    }

    function expectCartIsEmpty(): void {
      getCart(accessToken, cartId).then((cartResponse) => {
        expect(cartResponse.status).to.eq(200);
        expect(cartResponse.body.data.attributes.totals.priceToPay).to.eq(0);
      });
    }
  }
);
