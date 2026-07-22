import { ProductsBundleDynamicFixtures, ProductsBundleStaticFixtures } from '@interfaces/api';
import { createProduct, getProduct } from '@utils';
import { retryableBefore } from '../../../support/e2e';

describe('products backend api — bundles', { tags: ['@api', '@products', 'product'] }, (): void => {
  let staticFixtures: ProductsBundleStaticFixtures;
  let dynamicFixtures: ProductsBundleDynamicFixtures;
  let accessToken: string;
  let bundledSku: string;

  // Bundle products carry no own stock rows — availability derives from their components,
  // so the bundle is created without a `stocks` field (unlike a standalone concrete).
  const buildBundleBody = (bundleSku: string): Record<string, unknown> => ({
    sku: bundleSku,
    isActive: true,
    attributes: { color: 'blue' },
    localizedAttributes: {
      [staticFixtures.localeName]: { name: `Bundle ${bundleSku}`, isSearchable: true },
    },
    prices: [
      {
        priceTypeName: staticFixtures.priceTypeName,
        storeName: staticFixtures.storeName,
        currencyCode: staticFixtures.currencyCode,
        netAmount: staticFixtures.netAmount,
        grossAmount: staticFixtures.grossAmount,
      },
    ],
    productBundle: [{ sku: bundledSku, quantity: staticFixtures.bundleQuantity }],
  });

  retryableBefore((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
    bundledSku = dynamicFixtures.bundled.sku;
  });

  beforeEach((): void => {
    cy.getBackendApiToken().then((token) => {
      accessToken = token;
    });
  });

  it('should expose the seeded stock on the standalone bundled product', (): void => {
    getProduct(accessToken, bundledSku).then((response) => {
      expect(response.status).to.eq(200);

      const stock = response.body.data.attributes.stocks.find(
        (item: Record<string, unknown>) => item.stockName === staticFixtures.stockName
      );
      expect(stock, 'bundled stock present').to.not.be.undefined;
      expect(stock.quantity).to.eq(staticFixtures.bundledStockQuantity);
      expect(response.body.data.attributes.productBundle, 'component is not itself a bundle').to.be.empty;
    });
  });

  it('should assign a bundled product when creating a bundle', (): void => {
    const bundleSku = `pxm-bundle-${Date.now()}`;

    createProduct(accessToken, buildBundleBody(bundleSku)).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);

      const bundle = response.body.data.attributes.productBundle.find(
        (item: Record<string, unknown>) => item.sku === bundledSku
      );
      expect(bundle, 'bundled product assigned').to.not.be.undefined;
      expect(bundle.quantity).to.eq(staticFixtures.bundleQuantity);
    });
  });

  it('should persist the bundle assignment on a subsequent read', (): void => {
    const bundleSku = `pxm-bundle-read-${Date.now()}`;

    createProduct(accessToken, buildBundleBody(bundleSku)).then((createResponse) => {
      expect(createResponse.status, 'bundle created').to.be.oneOf([200, 201]);

      getProduct(accessToken, bundleSku).then((response) => {
        expect(response.status).to.eq(200);

        const bundle = response.body.data.attributes.productBundle.find(
          (item: Record<string, unknown>) => item.sku === bundledSku
        );
        expect(bundle, 'bundled product persisted').to.not.be.undefined;
        expect(bundle.quantity).to.eq(staticFixtures.bundleQuantity);

        // Bundle stock behaviour differs from a standalone concrete — logged for observation
        // rather than asserted blind; tighten once the real shape is confirmed.
        cy.log(`bundle stocks: ${JSON.stringify(response.body.data.attributes.stocks)}`);
      });
    });
  });
});
