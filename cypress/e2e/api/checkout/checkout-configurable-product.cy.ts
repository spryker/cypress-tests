import {
  CheckoutConfigurableProductDynamicFixtures,
  CheckoutConfigurableProductStaticFixtures,
} from '@interfaces/api';
import { authHeaders, buildProductConfigurationInstance } from '@utils';
import { retryableBefore } from '../../../support/e2e';

describe(
  'checkout configurable product',
  { tags: ['@api', '@checkout', 'product-configuration', 'configurable-product'] },
  (): void => {
    let staticFixtures: CheckoutConfigurableProductStaticFixtures;
    let dynamicFixtures: CheckoutConfigurableProductDynamicFixtures;
    let accessToken: string;
    let cartId: string;

    retryableBefore((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      cy.getCustomerAccessToken(dynamicFixtures.customer.email, staticFixtures.defaultPassword).then((token) => {
        accessToken = token;

        cy.createCart(accessToken, {
          name: 'Configurable checkout cart',
          priceMode: staticFixtures.priceMode,
          currency: staticFixtures.currency,
          store: staticFixtures.store,
        }).then((id) => {
          cartId = id;
        });
      });
    });

    it('should create an order with a configurable product', (): void => {
      addConfigurableItem().then((addResponse) => {
        expect(addResponse.status).to.eq(201);
        expect(addResponse.body.included[0].attributes.sku).to.eq(staticFixtures.sku);
        expect(addResponse.body.included[0].attributes.quantity).to.eq(staticFixtures.quantity);
        expect(addResponse.body.included[0].attributes.productConfigurationInstance.displayData).to.eq(
          staticFixtures.displayData
        );
        expect(addResponse.body.included[0].attributes.productConfigurationInstance.isComplete).to.eq(true);

        cy.request({
          method: 'POST',
          url: `${Cypress.env().glueUrl}/checkout?include=orders`,
          headers: authHeaders(accessToken),
          body: buildCheckoutPayload(),
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.data.type).to.eq('checkout');
          expect(response.body.data.attributes.orderReference).to.contain(`${staticFixtures.store}--`);
          expect(response.body.data.relationships.orders.data[0].type).to.eq('orders');

          const order = response.body.included[0];
          expect(order.type).to.eq('orders');
          expect(order.id).to.contain(`${staticFixtures.store}--`);
          expect(order.attributes.createdAt).to.not.be.empty;
          expect(order.attributes.currencyIsoCode).to.eq(staticFixtures.currency);
          expect(order.attributes.priceMode).to.eq(staticFixtures.priceMode);
          expect(order.attributes.totals.subtotal).to.be.greaterThan(0);
          expect(order.attributes.totals.grandTotal).to.be.greaterThan(0);
          expect(order.attributes.totals.canceledTotal).to.eq(0);

          const billing = order.attributes.billingAddress;
          expect(billing.salutation).to.eq(staticFixtures.address.salutation);
          expect(billing.firstName).to.eq(staticFixtures.address.firstName);
          expect(billing.lastName).to.eq(staticFixtures.address.lastName);
          expect(billing.address1).to.eq(staticFixtures.address.address1);
          expect(billing.zipCode).to.eq(staticFixtures.address.zipCode);
          expect(billing.city).to.eq(staticFixtures.address.city);
          expect(billing.iso2Code).to.eq(staticFixtures.address.iso2Code);
          expect(billing.company).to.eq(staticFixtures.address.company);
        });
      });
    });

    function addConfigurableItem(): Cypress.Chainable {
      const productConfigurationInstance = buildProductConfigurationInstance({
        displayData: staticFixtures.displayData,
        configuration: staticFixtures.configuration,
        configuratorKey: staticFixtures.configuratorKey,
        quantity: staticFixtures.quantity,
        availableQuantity: staticFixtures.availableQuantity,
        prices: staticFixtures.prices,
      });

      return cy.request({
        method: 'POST',
        url: `${Cypress.env().glueUrl}/carts/${cartId}/items?include=items`,
        headers: authHeaders(accessToken),
        body: {
          data: {
            type: 'items',
            attributes: {
              sku: staticFixtures.sku,
              quantity: staticFixtures.quantity,
              merchantReference: staticFixtures.merchantReference,
              productConfigurationInstance,
            },
          },
        },
      });
    }

    function buildCheckoutPayload(): Record<string, unknown> {
      const addressPayload = { ...staticFixtures.address, isDefaultBilling: false, isDefaultShipping: false };

      return {
        data: {
          type: 'checkout',
          attributes: {
            customer: {
              email: dynamicFixtures.customer.email,
              salutation: dynamicFixtures.customer.salutation,
              firstName: dynamicFixtures.customer.first_name,
              lastName: dynamicFixtures.customer.last_name,
            },
            idCart: cartId,
            billingAddress: addressPayload,
            shippingAddress: addressPayload,
            payments: [staticFixtures.payment],
            shipment: { idShipmentMethod: staticFixtures.idShipmentMethod },
            items: [staticFixtures.sku],
          },
        },
      };
    }
  }
);
