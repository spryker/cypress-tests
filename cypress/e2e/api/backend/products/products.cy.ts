import { ProductsDynamicFixtures, ProductsStaticFixtures } from '@interfaces/api';
import { createProduct, getProduct, getProductCollection, getProductWithoutToken, updateProduct } from '@utils';
import { retryableBefore } from '../../../../support/e2e';

// Non-nullable resource attributes always serialized (nullable ones — abstractSku, isActive,
// validFrom, validTo, taxSet — are omitted from the payload when null).
const EXPECTED_ATTRIBUTE_KEYS = [
  'sku',
  'attributes',
  'superAttributeValues',
  'localizedAttributes',
  'prices',
  'imageSets',
  'stocks',
  'productBundle',
  'productClass',
  'shipmentType',
  'stores',
  'categories',
];

// Well-formed uuid that matches no row — used for negative/deferred-validation cases.
const NON_EXISTENT_UUID = '00000000-0000-4000-8000-000000000000';

// productClass is referenced by its natural key, not a uuid.
const NON_EXISTENT_PRODUCT_CLASS_KEY = 'pxm-non-existent-product-class';

// Value written under the super-attribute key, so superAttributeValues can be asserted against it.
const SUPER_ATTRIBUTE_VALUE = 'blue';

describe('products backend api', { tags: ['@api', '@products', 'product'] }, (): void => {
  let staticFixtures: ProductsStaticFixtures;
  let dynamicFixtures: ProductsDynamicFixtures;
  let accessToken: string;
  let sku: string;
  let abstractSku: string;
  let bundledSku: string;

  // Builds a minimal valid POST body — every referenced natural key exists (Policy B enforces 422 otherwise).
  const buildValidProductBody = (concreteSku: string, parentAbstractSku: string | null): Record<string, unknown> => ({
    sku: concreteSku,
    ...(parentAbstractSku !== null ? { abstractSku: parentAbstractSku } : {}),
    isActive: true,
    attributes: { [staticFixtures.superAttributeKey]: SUPER_ATTRIBUTE_VALUE },
    localizedAttributes: [
      { localeName: staticFixtures.localeName, name: `Concrete ${concreteSku}`, isSearchable: true },
    ],
    prices: [
      {
        priceTypeName: staticFixtures.priceTypeName,
        storeName: staticFixtures.storeName,
        currencyCode: staticFixtures.currencyCode,
        netAmount: staticFixtures.netAmount,
        grossAmount: staticFixtures.grossAmount,
      },
    ],
    stocks: [{ stockName: staticFixtures.stockName, quantity: 42, isNeverOutOfStock: false }],
  });

  retryableBefore((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
    sku = dynamicFixtures.product.sku;
    abstractSku = dynamicFixtures.product.abstract_sku;
    bundledSku = dynamicFixtures.bundled.sku;
  });

  beforeEach((): void => {
    cy.getBackendApiToken().then((token) => {
      accessToken = token;
    });
  });

  describe('GET /products/{sku}', (): void => {
    it('should return the concrete product with core attributes', (): void => {
      getProduct(accessToken, sku).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.type).to.eq('products');
        expect(response.body.data.id).to.eq(sku);
        expect(response.body.data.attributes.sku).to.eq(sku);
        expect(response.body.data.attributes.abstractSku).to.eq(abstractSku);
        expect(response.body.data.attributes.isActive, 'seeded product is active').to.eq(true);
        expect(response.body.data.attributes).to.include.keys(EXPECTED_ATTRIBUTE_KEYS);
      });
    });

    it('should return the concrete product with all expanded relations', (): void => {
      getProduct(accessToken, sku).then((response) => {
        const attributes = response.body.data.attributes;

        const price = attributes.prices.find(
          (item: Record<string, unknown>) =>
            item.currencyCode === staticFixtures.currencyCode &&
            item.priceTypeName === staticFixtures.priceTypeName &&
            item.storeName === staticFixtures.storeName
        );
        expect(price, 'seeded price present').to.not.be.undefined;
        expect(price.netAmount).to.eq(staticFixtures.netAmount);
        expect(price.grossAmount).to.eq(staticFixtures.grossAmount);

        const stock = attributes.stocks.find(
          (item: Record<string, unknown>) => item.stockName === staticFixtures.stockName
        );
        expect(stock, 'seeded stock present').to.not.be.undefined;
        expect(stock.quantity).to.eq(100);

        expect(attributes.imageSets, 'imageSets').to.be.an('array').and.to.have.length.greaterThan(0);
        expect(attributes.imageSets[0].images, 'images').to.have.length.greaterThan(0);

        expect(attributes.localizedAttributes, 'localizedAttributes')
          .to.be.an('array')
          .and.to.have.length.greaterThan(0);
        expect(
          attributes.localizedAttributes.find(
            (entry: Record<string, unknown>) => entry.localeName === staticFixtures.localeName
          ),
          'seeded locale present'
        ).to.exist;

        expect(attributes.attributes, 'concrete attributes').to.have.property(
          staticFixtures.concreteAttributeKey,
          staticFixtures.concreteAttributeValue
        );

        // Product class is linked to the seeded product via the fixture; the API surfaces it by key+name.
        expect(attributes.productClass, 'productClass').to.be.an('array').and.to.have.length.greaterThan(0);
        expect(attributes.productClass[0], 'productClass item').to.have.all.keys('key', 'name');
        expect(
          attributes.productClass.map((item: { key: string }) => item.key),
          'seeded product class linked'
        ).to.include(dynamicFixtures.productClass.key);
      });
    });

    it('should expand abstract-level data read from the parent abstract', (): void => {
      // /products is self-contained: the abstract-owned fields it accepts on write are read back here.
      getProduct(accessToken, sku).then((response) => {
        const attributes = response.body.data.attributes;

        expect(attributes.stores, 'stores').to.be.an('array').and.to.have.length.greaterThan(0);
        expect(attributes.categories, 'categories').to.be.an('array');
      });
    });

    it('should return 404 for an unknown sku', (): void => {
      getProduct(accessToken, 'non-existent-concrete-sku', false).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should return 401 without an access token', (): void => {
      getProductWithoutToken(sku).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });

  describe('GET /products', (): void => {
    it('should return a collection of concrete products', (): void => {
      getProductCollection(accessToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array').and.to.have.length.greaterThan(0);

        response.body.data.forEach((item: { id: string; type: string; attributes: { sku: string } }) => {
          expect(item.type).to.eq('products');
          expect(item.id).to.be.a('string');
          expect(item.attributes.sku).to.eq(item.id);
          expect(item.attributes).to.include.keys(EXPECTED_ATTRIBUTE_KEYS);
        });
      });
    });

    it('should respect the itemsPerPage limit and page parameter', (): void => {
      getProductCollection(accessToken, { page: 1 }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.length, 'page size <= itemsPerPage').to.be.at.most(10);
      });
    });

    it('should return a different result set for page 2', (): void => {
      getProductCollection(accessToken, { page: 1 }).then((firstPage) => {
        expect(firstPage.status).to.eq(200);

        getProductCollection(accessToken, { page: 2 }).then((secondPage) => {
          expect(secondPage.status).to.eq(200);
          expect(secondPage.body.data.length, 'page 2 size <= itemsPerPage').to.be.at.most(10);

          const firstIds = firstPage.body.data.map((item: { id: string }) => item.id);
          const secondIds = secondPage.body.data.map((item: { id: string }) => item.id);
          // Pages must not overlap — every page-2 id is absent from page 1.
          secondIds.forEach((id: string) => expect(firstIds, 'no overlap between pages').to.not.include(id));
        });
      });
    });

    it('should return 401 without an access token', (): void => {
      getProductCollection('', {}, false).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });

  describe('POST /products', (): void => {
    it('should create a concrete product attached to an existing abstract', (): void => {
      const newSku = `pxm-concrete-${Date.now()}`;
      const body = {
        ...buildValidProductBody(newSku, abstractSku),
        shipmentType: [{ uuid: dynamicFixtures.shipmentType.uuid }],
      };

      createProduct(accessToken, body).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);

        const attributes = response.body.data.attributes;
        expect(response.body.data.id).to.eq(newSku);
        expect(attributes.sku).to.eq(newSku);
        expect(attributes.abstractSku).to.eq(abstractSku);

        const price = attributes.prices.find(
          (item: Record<string, unknown>) => item.currencyCode === staticFixtures.currencyCode
        );
        expect(price, 'price persisted').to.not.be.undefined;

        const stock = attributes.stocks.find(
          (item: Record<string, unknown>) => item.stockName === staticFixtures.stockName
        );
        expect(stock, 'stock persisted').to.not.be.undefined;
        expect(stock.quantity).to.eq(42);

        const shipmentType = attributes.shipmentType.find(
          (item: Record<string, unknown>) => item.uuid === dynamicFixtures.shipmentType.uuid
        );
        expect(shipmentType, 'shipment type assigned').to.not.be.undefined;

        // Derived server-side by the super-attribute expander: the subset of `attributes` whose keys
        // are super-attribute keys of the parent abstract. Empty here would mean the expander is unwired.
        expect(attributes.superAttributeValues, 'superAttributeValues derived from attributes').to.deep.include({
          [staticFixtures.superAttributeKey]: SUPER_ATTRIBUTE_VALUE,
        });
      });
    });

    it('should create a concrete product and auto-create its abstract when abstractSku is omitted', (): void => {
      const newSku = `pxm-solo-${Date.now()}`;

      createProduct(accessToken, buildValidProductBody(newSku, null)).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body.data.attributes.sku).to.eq(newSku);
        // Abstract SKU is derived from the concrete SKU via the `%s-abstract` pattern.
        expect(response.body.data.attributes.abstractSku).to.eq(`${newSku}-abstract`);
      });
    });

    it('should round-trip validFrom and validTo', (): void => {
      const newSku = `pxm-dates-${Date.now()}`;
      const validFrom = '2027-01-01 00:00:00';
      const validTo = '2027-12-31 00:00:00';

      createProduct(accessToken, { ...buildValidProductBody(newSku, abstractSku), validFrom, validTo }).then(
        (response) => {
          expect(response.status).to.be.oneOf([200, 201]);
          expect(response.body.data.attributes.validFrom, 'validFrom').to.contain('2027-01-01');
          expect(response.body.data.attributes.validTo, 'validTo').to.contain('2027-12-31');
        }
      );
    });

    it('should persist a never-out-of-stock stock and multiple prices', (): void => {
      const newSku = `pxm-relations-${Date.now()}`;
      const body = {
        ...buildValidProductBody(newSku, abstractSku),
        stocks: [{ stockName: staticFixtures.stockName, quantity: 0, isNeverOutOfStock: true }],
      };

      createProduct(accessToken, body).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);

        const stock = response.body.data.attributes.stocks.find(
          (item: Record<string, unknown>) => item.stockName === staticFixtures.stockName
        );
        expect(stock, 'stock persisted').to.not.be.undefined;
        expect(stock.isNeverOutOfStock, 'never out of stock').to.eq(true);
      });
    });

    it('should persist image sets created on POST', (): void => {
      const newSku = `pxm-images-${Date.now()}`;
      const body = {
        ...buildValidProductBody(newSku, abstractSku),
        imageSets: [
          {
            localeName: staticFixtures.localeName,
            images: [
              {
                externalUrlSmall: 'https://example.com/small.jpg',
                externalUrlLarge: 'https://example.com/large.jpg',
                sortOrder: 0,
              },
            ],
          },
        ],
      };

      createProduct(accessToken, body).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body.data.attributes.imageSets, 'imageSets persisted')
          .to.be.an('array')
          .and.to.have.length.greaterThan(0);
      });
    });

    it('should reject creating a product with an already existing sku', (): void => {
      createProduct(accessToken, buildValidProductBody(sku, abstractSku), false).then((response) => {
        // Duplicate identifier must not succeed; exact code depends on the endpoint's conflict handling.
        expect(response.status, 'duplicate sku rejected').to.be.at.least(400);
        cy.log(`duplicate sku status: ${response.status}, body: ${JSON.stringify(response.body)}`);
      });
    });

    it('should return 401 without an access token', (): void => {
      createProduct('', buildValidProductBody(`pxm-noauth-${Date.now()}`, abstractSku), false).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });

  describe('PATCH /products/{sku}', (): void => {
    let patchSku: string;

    beforeEach((): void => {
      patchSku = `pxm-patch-${Date.now()}`;
      createProduct(accessToken, buildValidProductBody(patchSku, abstractSku)).then((response) => {
        expect(response.status, 'setup product created').to.be.oneOf([200, 201]);
      });
    });

    it('should update the concrete product attributes', (): void => {
      updateProduct(accessToken, patchSku, {
        isActive: false,
        attributes: { color: 'green' },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.attributes.sku).to.eq(patchSku);
        expect(response.body.data.attributes.isActive).to.eq(false);
        expect(response.body.data.attributes.attributes).to.deep.include({ color: 'green' });
      });
    });

    it('should update localized attributes', (): void => {
      updateProduct(accessToken, patchSku, {
        localizedAttributes: [{ localeName: staticFixtures.localeName, name: 'Patched name', isSearchable: false }],
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(
          response.body.data.attributes.localizedAttributes.find(
            (entry: Record<string, unknown>) => entry.localeName === staticFixtures.localeName
          ).name
        ).to.eq('Patched name');
      });
    });

    it('should update stock quantity on the concrete product', (): void => {
      updateProduct(accessToken, patchSku, {
        stocks: [{ stockName: staticFixtures.stockName, quantity: 7, isNeverOutOfStock: false }],
      }).then((response) => {
        expect(response.status).to.eq(200);

        const stock = response.body.data.attributes.stocks.find(
          (item: Record<string, unknown>) => item.stockName === staticFixtures.stockName
        );
        expect(stock, 'stock present').to.not.be.undefined;
        expect(stock.quantity, 'stock quantity updated').to.eq(7);
      });
    });

    it('should preserve untouched relations on an incremental patch', (): void => {
      // Incremental update: patching only isActive must leave the seeded price and stock intact.
      updateProduct(accessToken, patchSku, { isActive: false }).then((response) => {
        expect(response.status).to.eq(200);

        const attributes = response.body.data.attributes;
        expect(attributes.isActive, 'isActive updated').to.eq(false);

        const price = attributes.prices.find(
          (item: Record<string, unknown>) => item.currencyCode === staticFixtures.currencyCode
        );
        expect(price, 'price preserved').to.not.be.undefined;

        const stock = attributes.stocks.find(
          (item: Record<string, unknown>) => item.stockName === staticFixtures.stockName
        );
        expect(stock, 'stock preserved').to.not.be.undefined;
      });
    });

    it('should not re-create price rows on a patch that does not touch prices', (): void => {
      // A stable price uuid is the observable proof that the spy_price_product_store row was
      // reused rather than deleted and re-inserted.
      getProduct(accessToken, patchSku).then((beforeResponse) => {
        expect(beforeResponse.status).to.eq(200);

        const priceBefore = beforeResponse.body.data.attributes.prices.find(
          (item: Record<string, unknown>) => item.currencyCode === staticFixtures.currencyCode
        );
        expect(priceBefore, 'seeded price present').to.not.be.undefined;
        expect(priceBefore.uuid, 'seeded price has a uuid').to.be.a('string');

        updateProduct(accessToken, patchSku, { attributes: { color: 'green' } }).then((response) => {
          expect(response.status).to.eq(200);

          const priceAfter = response.body.data.attributes.prices.find(
            (item: Record<string, unknown>) => item.currencyCode === staticFixtures.currencyCode
          );
          expect(priceAfter, 'price still present').to.not.be.undefined;
          expect(priceAfter.uuid, 'price row reused').to.eq(priceBefore.uuid);
        });
      });
    });

    it('should update a price amount without dropping the other prices', (): void => {
      updateProduct(accessToken, patchSku, {
        prices: [
          {
            priceTypeName: staticFixtures.priceTypeName,
            storeName: staticFixtures.storeName,
            currencyCode: staticFixtures.currencyCode,
            netAmount: staticFixtures.netAmount + 100,
            grossAmount: staticFixtures.grossAmount + 100,
          },
        ],
      }).then((response) => {
        expect(response.status).to.eq(200);

        const prices = response.body.data.attributes.prices;
        const price = prices.find(
          (item: Record<string, unknown>) =>
            item.priceTypeName === staticFixtures.priceTypeName &&
            item.currencyCode === staticFixtures.currencyCode &&
            item.storeName === staticFixtures.storeName
        );
        expect(price, 'patched price present').to.not.be.undefined;
        expect(price.netAmount, 'net amount updated').to.eq(staticFixtures.netAmount + 100);
        expect(price.grossAmount, 'gross amount updated').to.eq(staticFixtures.grossAmount + 100);

        const duplicates = prices.filter(
          (item: Record<string, unknown>) =>
            item.priceTypeName === staticFixtures.priceTypeName &&
            item.currencyCode === staticFixtures.currencyCode &&
            item.storeName === staticFixtures.storeName
        );
        expect(duplicates.length, 'no duplicate price for the same type/currency/store').to.eq(1);
      });
    });

    it('should reuse the price row when a price carrying volume prices is re-sent unchanged', (): void => {
      // Regression: the writer matches the existing row on price_data_checksum, so a price with
      // volume prices must keep its stored checksum through the merge or it mints a new row.
      const volumePriceSku = `pxm-volume-idem-${Date.now()}`;
      const volumePrices = [
        { quantity: 10, netPrice: staticFixtures.netAmount - 100, grossPrice: staticFixtures.grossAmount - 100 },
      ];
      const priceBody = {
        priceTypeName: staticFixtures.priceTypeName,
        storeName: staticFixtures.storeName,
        currencyCode: staticFixtures.currencyCode,
        netAmount: staticFixtures.netAmount,
        grossAmount: staticFixtures.grossAmount,
        volumePrices,
      };
      const body = buildValidProductBody(volumePriceSku, abstractSku) as Record<string, unknown>;
      body.prices = [priceBody];

      createProduct(accessToken, body).then((createResponse) => {
        expect(createResponse.status, 'product with volume prices created').to.be.oneOf([200, 201]);

        getProduct(accessToken, volumePriceSku).then((beforeResponse) => {
          const priceBefore = beforeResponse.body.data.attributes.prices.find(
            (item: Record<string, unknown>) => item.currencyCode === staticFixtures.currencyCode
          );
          expect(priceBefore.volumePrices, 'tiers seeded').to.have.length(1);

          updateProduct(accessToken, volumePriceSku, { prices: [priceBody] }).then((response) => {
            expect(response.status).to.eq(200);

            const priceAfter = response.body.data.attributes.prices.find(
              (item: Record<string, unknown>) => item.currencyCode === staticFixtures.currencyCode
            );
            expect(priceAfter.uuid, 'price row reused for an unchanged volume price').to.eq(priceBefore.uuid);
            expect(priceAfter.volumePrices, 'tiers intact').to.have.length(1);
          });
        });
      });
    });

    it('should update volume tiers in place without re-creating the price row', (): void => {
      const volumePriceSku = `pxm-volume-edit-${Date.now()}`;
      const priceBody = {
        priceTypeName: staticFixtures.priceTypeName,
        storeName: staticFixtures.storeName,
        currencyCode: staticFixtures.currencyCode,
        netAmount: staticFixtures.netAmount,
        grossAmount: staticFixtures.grossAmount,
        volumePrices: [{ quantity: 10, netPrice: 600, grossPrice: 666 }],
      };
      const body = buildValidProductBody(volumePriceSku, abstractSku) as Record<string, unknown>;
      body.prices = [priceBody];

      createProduct(accessToken, body).then((createResponse) => {
        expect(createResponse.status, 'product with volume prices created').to.be.oneOf([200, 201]);

        getProduct(accessToken, volumePriceSku).then((beforeResponse) => {
          const priceBefore = beforeResponse.body.data.attributes.prices.find(
            (item: Record<string, unknown>) => item.currencyCode === staticFixtures.currencyCode
          );

          // Amounts unchanged, tiers changed: the row is matched on the stored checksum and updated.
          updateProduct(accessToken, volumePriceSku, {
            prices: [{ ...priceBody, volumePrices: [{ quantity: 25, netPrice: 400, grossPrice: 444 }] }],
          }).then((response) => {
            expect(response.status).to.eq(200);

            const priceAfter = response.body.data.attributes.prices.find(
              (item: Record<string, unknown>) => item.currencyCode === staticFixtures.currencyCode
            );
            expect(priceAfter.uuid, 'price row reused').to.eq(priceBefore.uuid);
            expect(priceAfter.volumePrices, 'single tier after edit').to.have.length(1);
            expect(priceAfter.volumePrices[0].quantity, 'tier replaced').to.eq(25);
          });
        });
      });
    });

    it('should preserve volume prices when the patch omits volumePrices', (): void => {
      const volumePriceSku = `pxm-volume-${Date.now()}`;
      const body = buildValidProductBody(volumePriceSku, abstractSku) as Record<string, unknown>;
      (body.prices as Record<string, unknown>[])[0].volumePrices = [
        { quantity: 10, netPrice: staticFixtures.netAmount - 100, grossPrice: staticFixtures.grossAmount - 100 },
      ];

      createProduct(accessToken, body).then((createResponse) => {
        expect(createResponse.status, 'product with volume prices created').to.be.oneOf([200, 201]);

        // Re-sends the price with a new amount but WITHOUT volumePrices: omitting the property
        // must not clear the stored tiers.
        updateProduct(accessToken, volumePriceSku, {
          prices: [
            {
              priceTypeName: staticFixtures.priceTypeName,
              storeName: staticFixtures.storeName,
              currencyCode: staticFixtures.currencyCode,
              netAmount: staticFixtures.netAmount + 50,
              grossAmount: staticFixtures.grossAmount + 50,
            },
          ],
        }).then((response) => {
          expect(response.status).to.eq(200);

          const price = response.body.data.attributes.prices.find(
            (item: Record<string, unknown>) => item.currencyCode === staticFixtures.currencyCode
          );
          expect(price, 'price present').to.not.be.undefined;
          expect(price.grossAmount, 'gross amount updated').to.eq(staticFixtures.grossAmount + 50);
          expect(price.volumePrices, 'volume prices preserved').to.have.length(1);
          expect(price.volumePrices[0].quantity).to.eq(10);
        });
      });
    });

    it('should clear volume prices when the patch sends an empty volumePrices array', (): void => {
      const volumePriceSku = `pxm-volume-clear-${Date.now()}`;
      const body = buildValidProductBody(volumePriceSku, abstractSku) as Record<string, unknown>;
      (body.prices as Record<string, unknown>[])[0].volumePrices = [
        { quantity: 10, netPrice: staticFixtures.netAmount - 100, grossPrice: staticFixtures.grossAmount - 100 },
      ];

      createProduct(accessToken, body).then((createResponse) => {
        expect(createResponse.status, 'product with volume prices created').to.be.oneOf([200, 201]);

        updateProduct(accessToken, volumePriceSku, {
          prices: [
            {
              priceTypeName: staticFixtures.priceTypeName,
              storeName: staticFixtures.storeName,
              currencyCode: staticFixtures.currencyCode,
              netAmount: staticFixtures.netAmount,
              grossAmount: staticFixtures.grossAmount,
              volumePrices: [],
            },
          ],
        }).then((response) => {
          expect(response.status).to.eq(200);

          const price = response.body.data.attributes.prices.find(
            (item: Record<string, unknown>) => item.currencyCode === staticFixtures.currencyCode
          );
          expect(price, 'price present').to.not.be.undefined;
          expect(price.volumePrices, 'volume prices cleared').to.have.length(0);
        });
      });
    });

    it('should reject changing the abstractSku on patch (immutable)', (): void => {
      updateProduct(accessToken, patchSku, { abstractSku: 'some-other-abstract-sku', isActive: true }, false).then(
        (response) => {
          expect(response.status, 'abstractSku is immutable').to.eq(422);
        }
      );
    });

    it('should return 404 when patching an unknown sku', (): void => {
      updateProduct(accessToken, 'non-existent-concrete-sku', { isActive: false }, false).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should return 401 without an access token', (): void => {
      updateProduct('', patchSku, { isActive: false }, false).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });

  // Abstract-level fields (stores, taxSet, categories, newFrom, newTo) are written through the concrete
  // /products endpoint and read back from the same resource — PXM resolves the parent abstract itself.
  describe('abstract-level writes via /products', (): void => {
    it('should assign abstract stores when auto-creating the abstract (abstractSku omitted)', (): void => {
      const newSku = `pxm-abs-create-${Date.now()}`;

      createProduct(accessToken, { ...buildValidProductBody(newSku, null), stores: [staticFixtures.storeName] }).then(
        (response) => {
          expect(response.status, 'concrete created').to.be.oneOf([200, 201]);
          expect(response.body.data.attributes.stores, 'stores echoed on the write response').to.include(
            staticFixtures.storeName
          );

          getProduct(accessToken, newSku).then((getResponse) => {
            expect(getResponse.status).to.eq(200);
            expect(getResponse.body.data.attributes.stores, 'abstract stores').to.include(staticFixtures.storeName);
          });
        }
      );
    });

    it('should edit abstract stores when patching a concrete attached to an existing abstract', (): void => {
      const patchSku = `pxm-abs-merge-${Date.now()}`;

      createProduct(accessToken, buildValidProductBody(patchSku, abstractSku)).then((createResponse) => {
        expect(createResponse.status, 'setup product created').to.be.oneOf([200, 201]);

        updateProduct(accessToken, patchSku, { stores: ['DE', 'AT'] }).then((patchResponse) => {
          expect(patchResponse.status).to.eq(200);

          getProduct(accessToken, patchSku).then((getResponse) => {
            expect(getResponse.status).to.eq(200);
            expect(getResponse.body.data.attributes.stores, 'abstract stores').to.include.members(['DE', 'AT']);
          });
        });
      });
    });

    it('should assign taxSet and categories via POST and read them back', (): void => {
      // Real uuids are sourced from demo catalog products (seed helpers do not expose behaviour-generated
      // uuids, and the freshly seeded abstract carries none). Demo abstracts are taxed + categorised.
      getProductCollection(accessToken, { page: 1 }).then((collection) => {
        expect(collection.status).to.eq(200);

        const withRefs = collection.body.data.find(
          (item: { attributes: { taxSet?: { uuid?: string }; categories: Array<{ uuid: string }> } }) =>
            item.attributes.taxSet?.uuid && item.attributes.categories.length > 0
        );
        expect(withRefs, 'a demo product with a taxSet and category exists on page 1').to.not.be.undefined;

        const taxSetUuid = withRefs.attributes.taxSet.uuid;
        const categoryUuid = withRefs.attributes.categories[0].uuid;
        const newSku = `pxm-abs-refs-${Date.now()}`;

        createProduct(accessToken, {
          ...buildValidProductBody(newSku, null),
          taxSet: { uuid: taxSetUuid },
          categories: [{ uuid: categoryUuid }],
        }).then((response) => {
          expect(response.status, 'concrete created').to.be.oneOf([200, 201]);

          getProduct(accessToken, newSku).then((getResponse) => {
            expect(getResponse.status).to.eq(200);
            expect(getResponse.body.data.attributes.taxSet.uuid, 'taxSet assigned').to.eq(taxSetUuid);
            expect(getResponse.body.data.attributes.taxSet.name, 'taxSet name read back').to.be.a('string').and.not.be
              .empty;

            const category = getResponse.body.data.attributes.categories.find(
              (item: { uuid: string }) => item.uuid === categoryUuid
            );
            expect(category, 'category assigned').to.not.be.undefined;
            expect(category.categoryKey, 'category key read back').to.be.a('string').and.not.be.empty;
            expect(category.localizedAttributes, 'category localizedAttributes read back').to.be.an('array');
          });
        });
      });
    });

    it('should not remove existing abstract categories on PATCH (additive-only)', (): void => {
      // Regression: the generated resource defaults categories to [] and cannot tell "omitted" from
      // an explicit empty array, so PATCH must treat both as a no-op — never a clear-all.
      getProductCollection(accessToken, { page: 1 }).then((collection) => {
        expect(collection.status).to.eq(200);

        const withCategory = collection.body.data.find(
          (item: { attributes: { categories: Array<{ uuid: string }> } }) => item.attributes.categories.length > 0
        );
        expect(withCategory, 'a demo product with a category exists on page 1').to.not.be.undefined;

        const categoryUuid = withCategory.attributes.categories[0].uuid;
        const newSku = `pxm-cat-additive-${Date.now()}`;

        // Auto-create the abstract with one category assigned.
        createProduct(accessToken, {
          ...buildValidProductBody(newSku, null),
          categories: [{ uuid: categoryUuid }],
        }).then((createResponse) => {
          expect(createResponse.status, 'concrete created').to.be.oneOf([200, 201]);

          // PATCH with categories OMITTED must not clear them.
          updateProduct(accessToken, newSku, { isActive: false }).then((patchOmitResponse) => {
            expect(patchOmitResponse.status).to.eq(200);

            getProduct(accessToken, newSku).then((afterOmit) => {
              const uuidsAfterOmit = afterOmit.body.data.attributes.categories.map((c: { uuid: string }) => c.uuid);
              expect(uuidsAfterOmit, 'category kept when categories omitted on PATCH').to.include(categoryUuid);

              // PATCH with an explicit empty categories array must also not clear them.
              updateProduct(accessToken, newSku, { categories: [] }).then((patchEmptyResponse) => {
                expect(patchEmptyResponse.status).to.eq(200);

                getProduct(accessToken, newSku).then((afterEmpty) => {
                  const uuidsAfterEmpty = afterEmpty.body.data.attributes.categories.map(
                    (c: { uuid: string }) => c.uuid
                  );
                  expect(uuidsAfterEmpty, 'category kept when categories = [] on PATCH').to.include(categoryUuid);
                });
              });
            });
          });
        });
      });
    });

    it('should assign newFrom and newTo to the abstract when auto-creating it', (): void => {
      const newSku = `pxm-abs-new-${Date.now()}`;
      const newFrom = '2027-01-01 00:00:00';
      const newTo = '2027-12-31 00:00:00';

      createProduct(accessToken, { ...buildValidProductBody(newSku, null), newFrom, newTo }).then((response) => {
        expect(response.status, 'concrete created').to.be.oneOf([200, 201]);

        getProduct(accessToken, newSku).then((getResponse) => {
          expect(getResponse.status).to.eq(200);
          expect(getResponse.body.data.attributes.newFrom, 'newFrom assigned').to.contain('2027-01-01');
          expect(getResponse.body.data.attributes.newTo, 'newTo assigned').to.contain('2027-12-31');
        });
      });
    });

    it('should edit newFrom and newTo on the abstract via PATCH', (): void => {
      const patchSku = `pxm-abs-new-patch-${Date.now()}`;

      createProduct(accessToken, buildValidProductBody(patchSku, abstractSku)).then((createResponse) => {
        expect(createResponse.status, 'setup product created').to.be.oneOf([200, 201]);

        updateProduct(accessToken, patchSku, {
          newFrom: '2028-03-01 00:00:00',
          newTo: '2028-04-01 00:00:00',
        }).then((patchResponse) => {
          expect(patchResponse.status).to.eq(200);
          expect(patchResponse.body.data.attributes.newFrom, 'newFrom echoed on the write response').to.contain(
            '2028-03-01'
          );

          getProduct(accessToken, patchSku).then((getResponse) => {
            expect(getResponse.status).to.eq(200);
            expect(getResponse.body.data.attributes.newFrom, 'newFrom edited').to.contain('2028-03-01');
            expect(getResponse.body.data.attributes.newTo, 'newTo edited').to.contain('2028-04-01');
          });
        });
      });
    });
  });

  describe('POST /products validation', (): void => {
    // Each case sends one invalid field on top of an otherwise-valid body and expects a 422.
    const invalidCases: Array<{ title: string; override: Record<string, unknown> }> = [
      { title: 'blank sku', override: { sku: '' } },
      { title: 'invalid validFrom datetime', override: { validFrom: 'not-a-date' } },
      {
        title: 'unknown currency',
        override: {
          prices: [
            {
              priceTypeName: 'DEFAULT',
              storeName: 'DE',
              currencyCode: 'ZZZ',
              netAmount: 100,
              grossAmount: 100,
            },
          ],
        },
      },
      {
        title: 'unknown price type',
        override: {
          prices: [
            {
              priceTypeName: 'NON_EXISTENT_TYPE',
              storeName: 'DE',
              currencyCode: 'EUR',
              netAmount: 100,
              grossAmount: 100,
            },
          ],
        },
      },
      {
        title: 'negative price amount',
        override: {
          prices: [
            {
              priceTypeName: 'DEFAULT',
              storeName: 'DE',
              currencyCode: 'EUR',
              netAmount: -1,
              grossAmount: -1,
            },
          ],
        },
      },
      {
        title: 'unknown stock name',
        override: { stocks: [{ stockName: 'NON_EXISTENT_WAREHOUSE', quantity: 1, isNeverOutOfStock: false }] },
      },
      {
        title: 'unknown store',
        override: { stores: ['ZZ'] },
      },
      {
        title: 'invalid taxSet uuid format',
        override: { taxSet: { uuid: 'not-a-uuid' } },
      },
      {
        title: 'invalid image url',
        override: {
          imageSets: [
            {
              localeName: 'en_US',
              images: [{ externalUrlSmall: 'not-a-url', externalUrlLarge: 'not-a-url' }],
            },
          ],
        },
      },
      {
        title: 'non-positive bundle quantity',
        override: { productBundle: [{ sku: 'some-sku', quantity: 0 }] },
      },
      {
        title: 'validFrom later than validTo',
        override: { validFrom: '2027-12-31 00:00:00', validTo: '2027-01-01 00:00:00' },
      },
      {
        title: 'newFrom later than newTo',
        override: { newFrom: '2027-12-31 00:00:00', newTo: '2027-01-01 00:00:00' },
      },
      {
        title: 'unknown abstractSku',
        override: { abstractSku: 'non-existent-abstract-sku' },
      },
      {
        title: 'unknown shipmentType uuid',
        override: { shipmentType: [{ uuid: NON_EXISTENT_UUID }] },
      },
      {
        title: 'unknown locale in localizedAttributes',
        override: { localizedAttributes: [{ localeName: 'zz_ZZ', name: 'Unknown locale', isSearchable: true }] },
      },
      {
        // Image urls are deliberately valid so the 422 can only come from the locale check.
        title: 'unknown locale in imageSets',
        override: {
          imageSets: [
            {
              localeName: 'zz_ZZ',
              images: [
                {
                  externalUrlSmall: 'https://example.org/small.png',
                  externalUrlLarge: 'https://example.org/large.png',
                },
              ],
            },
          ],
        },
      },
      {
        title: 'unknown category uuid',
        override: { categories: [{ uuid: NON_EXISTENT_UUID }] },
      },
    ];

    invalidCases.forEach(({ title, override }) => {
      it(`should reject ${title} with 422`, (): void => {
        const body = { ...buildValidProductBody(`pxm-invalid-${Date.now()}`, abstractSku), ...override };

        createProduct(accessToken, body, false).then((response) => {
          expect(response.status).to.eq(422);
        });
      });
    });

    // productClass and taxSet are existence-checked (TaxSetExistsValidatorPlugin / ProductClassExistsValidatorPlugin);
    // a well-formed but unknown uuid must be rejected with 422, never silently skipped.
    it('should reject an unknown taxSet uuid with 422', (): void => {
      const newSku = `pxm-unknown-taxset-${Date.now()}`;
      const body = { ...buildValidProductBody(newSku, abstractSku), taxSet: { uuid: NON_EXISTENT_UUID } };

      createProduct(accessToken, body, false).then((response) => {
        expect(response.status, 'unknown taxSet uuid rejected').to.eq(422);
      });
    });

    it('should reject an unknown productClass key with 422', (): void => {
      const newSku = `pxm-unknown-class-${Date.now()}`;
      const body = {
        ...buildValidProductBody(newSku, abstractSku),
        productClass: [{ key: NON_EXISTENT_PRODUCT_CLASS_KEY }],
      };

      createProduct(accessToken, body, false).then((response) => {
        expect(response.status, 'unknown productClass key rejected').to.eq(422);
      });
    });
  });

  describe('PATCH /products validation', (): void => {
    let patchSku: string;

    beforeEach((): void => {
      patchSku = `pxm-patch-invalid-${Date.now()}`;
      createProduct(accessToken, buildValidProductBody(patchSku, abstractSku)).then((response) => {
        expect(response.status, 'setup product created').to.be.oneOf([200, 201]);
      });
    });

    // Mirror of the POST validation cases that apply to PATCH. Omitted on purpose:
    // `blank sku` (sku is the URL identifier, never patched) and `unknown abstractSku`
    // (abstractSku is immutable on PATCH — covered by the dedicated immutability test above).
    const invalidCases: Array<{ title: string; override: Record<string, unknown> }> = [
      { title: 'invalid validFrom datetime', override: { validFrom: 'not-a-date' } },
      {
        title: 'unknown currency',
        override: {
          prices: [
            { priceTypeName: 'DEFAULT', storeName: 'DE', currencyCode: 'ZZZ', netAmount: 100, grossAmount: 100 },
          ],
        },
      },
      {
        title: 'unknown price type',
        override: {
          prices: [
            {
              priceTypeName: 'NON_EXISTENT_TYPE',
              storeName: 'DE',
              currencyCode: 'EUR',
              netAmount: 100,
              grossAmount: 100,
            },
          ],
        },
      },
      {
        title: 'negative price amount',
        override: {
          prices: [{ priceTypeName: 'DEFAULT', storeName: 'DE', currencyCode: 'EUR', netAmount: -1, grossAmount: -1 }],
        },
      },
      {
        title: 'unknown stock name',
        override: { stocks: [{ stockName: 'NON_EXISTENT_WAREHOUSE', quantity: 1, isNeverOutOfStock: false }] },
      },
      {
        title: 'unknown store',
        override: { stores: ['ZZ'] },
      },
      {
        title: 'invalid taxSet uuid format',
        override: { taxSet: { uuid: 'not-a-uuid' } },
      },
      {
        title: 'invalid image url',
        override: {
          imageSets: [
            { localeName: 'en_US', images: [{ externalUrlSmall: 'not-a-url', externalUrlLarge: 'not-a-url' }] },
          ],
        },
      },
      {
        title: 'non-positive bundle quantity',
        override: { productBundle: [{ sku: 'some-sku', quantity: 0 }] },
      },
      {
        title: 'validFrom later than validTo',
        override: { validFrom: '2027-12-31 00:00:00', validTo: '2027-01-01 00:00:00' },
      },
      {
        title: 'newFrom later than newTo',
        override: { newFrom: '2027-12-31 00:00:00', newTo: '2027-01-01 00:00:00' },
      },
      {
        title: 'unknown shipmentType uuid',
        override: { shipmentType: [{ uuid: NON_EXISTENT_UUID }] },
      },
      {
        title: 'unknown locale in localizedAttributes',
        override: { localizedAttributes: [{ localeName: 'zz_ZZ', name: 'Unknown locale', isSearchable: true }] },
      },
      {
        // Image urls are deliberately valid so the 422 can only come from the locale check.
        title: 'unknown locale in imageSets',
        override: {
          imageSets: [
            {
              localeName: 'zz_ZZ',
              images: [
                {
                  externalUrlSmall: 'https://example.org/small.png',
                  externalUrlLarge: 'https://example.org/large.png',
                },
              ],
            },
          ],
        },
      },
      {
        title: 'unknown category uuid',
        override: { categories: [{ uuid: NON_EXISTENT_UUID }] },
      },
    ];

    invalidCases.forEach(({ title, override }) => {
      it(`should reject ${title} with 422`, (): void => {
        updateProduct(accessToken, patchSku, override, false).then((response) => {
          expect(response.status).to.eq(422);
        });
      });
    });

    // Existence-checked references (TaxSetExistsValidatorPlugin by uuid / ProductClassExistsValidatorPlugin by key)
    // must be rejected on PATCH too — never silently skipped. taxSet writes through to the parent abstract.
    it('should reject an unknown taxSet uuid with 422', (): void => {
      updateProduct(accessToken, patchSku, { taxSet: { uuid: NON_EXISTENT_UUID } }, false).then((response) => {
        expect(response.status, 'unknown taxSet uuid rejected on patch').to.eq(422);
      });
    });

    it('should reject an unknown productClass key with 422', (): void => {
      updateProduct(accessToken, patchSku, { productClass: [{ key: NON_EXISTENT_PRODUCT_CLASS_KEY }] }, false).then(
        (response) => {
          expect(response.status, 'unknown productClass key rejected on patch').to.eq(422);
        }
      );
    });

    // PATCH-only: validation runs before the merge, so a request that fails validation must persist NOTHING —
    // not even the valid fields sent alongside the invalid one.
    it('should not apply any field when the patch fails validation', (): void => {
      updateProduct(
        accessToken,
        patchSku,
        {
          stocks: [{ stockName: staticFixtures.stockName, quantity: 7, isNeverOutOfStock: false }],
          categories: [{ uuid: NON_EXISTENT_UUID }],
        },
        false
      ).then((patchResponse) => {
        expect(patchResponse.status, 'patch rejected').to.eq(422);

        // The valid stock change must not have been persisted — quantity stays at the created baseline (42).
        getProduct(accessToken, patchSku).then((getResponse) => {
          const stock = getResponse.body.data.attributes.stocks.find(
            (item: Record<string, unknown>) => item.stockName === staticFixtures.stockName
          );
          expect(stock.quantity, 'valid stock change rolled back on failed patch').to.eq(42);
        });
      });
    });
  });

  describe('POST /products envelope', (): void => {
    const productsUrl = (): string => `${Cypress.env().glueBackendUrl}/products`;

    it('should reject a body without the JSON:API data envelope with 400', (): void => {
      cy.request({
        method: 'POST',
        url: productsUrl(),
        headers: { 'Content-Type': 'application/vnd.api+json', Authorization: `Bearer ${accessToken}` },
        body: { sku: `pxm-flat-${Date.now()}` },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should reject a PATCH with a missing resource id (trailing slash) with 400', (): void => {
      cy.request({
        method: 'PATCH',
        url: `${productsUrl()}/`,
        headers: { 'Content-Type': 'application/vnd.api+json', Authorization: `Bearer ${accessToken}` },
        body: { data: { type: 'products', attributes: { isActive: false } } },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe('bundles', (): void => {
    // Bundle products carry no own stock rows — availability derives from their components,
    // so the bundle is created without a `stocks` field (unlike a standalone concrete).
    const buildBundleBody = (bundleSku: string): Record<string, unknown> => ({
      sku: bundleSku,
      isActive: true,
      attributes: { color: 'blue' },
      localizedAttributes: [{ localeName: staticFixtures.localeName, name: `Bundle ${bundleSku}`, isSearchable: true }],
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
});
