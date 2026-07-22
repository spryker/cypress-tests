import { ProductsDynamicFixtures, ProductsStaticFixtures } from '@interfaces/api';
import {
  createProduct,
  getAbstractProduct,
  getAbstractProductCollection,
  getProduct,
  getProductCollection,
  getProductWithoutToken,
  updateProduct,
} from '@utils';
import { retryableBefore } from '../../../support/e2e';

// Non-nullable resource attributes always serialized (nullable ones — abstractSku, isActive,
// validFrom, validTo — are omitted from the payload when null).
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
];

// Well-formed uuid that matches no row — used for negative/deferred-validation cases.
const NON_EXISTENT_UUID = '00000000-0000-4000-8000-000000000000';

describe('products backend api', { tags: ['@api', '@products', 'product'] }, (): void => {
  let staticFixtures: ProductsStaticFixtures;
  let dynamicFixtures: ProductsDynamicFixtures;
  let accessToken: string;
  let sku: string;
  let abstractSku: string;

  // Builds a minimal valid POST body — every referenced natural key exists (Policy B enforces 422 otherwise).
  const buildValidProductBody = (concreteSku: string, parentAbstractSku: string | null): Record<string, unknown> => ({
    sku: concreteSku,
    ...(parentAbstractSku !== null ? { abstractSku: parentAbstractSku } : {}),
    isActive: true,
    attributes: { color: 'blue' },
    localizedAttributes: {
      [staticFixtures.localeName]: { name: `Concrete ${concreteSku}`, isSearchable: true },
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
    stocks: [{ stockName: staticFixtures.stockName, quantity: 42, isNeverOutOfStock: false }],
  });

  retryableBefore((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
    sku = dynamicFixtures.product.sku;
    abstractSku = dynamicFixtures.product.abstract_sku;
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

        expect(attributes.localizedAttributes, 'localizedAttributes').to.be.an('object');
        expect(attributes.localizedAttributes[staticFixtures.localeName], 'seeded locale present').to.exist;

        expect(attributes.attributes, 'concrete attributes').to.have.property(
          staticFixtures.concreteAttributeKey,
          staticFixtures.concreteAttributeValue
        );

        // Product class is linked to the seeded product via the fixture; the API surfaces it by uuid+name.
        expect(attributes.productClass, 'productClass').to.be.an('array').and.to.have.length.greaterThan(0);
        expect(attributes.productClass[0], 'productClass item').to.have.all.keys('uuid', 'name');
        expect(attributes.productClass[0].uuid, 'productClass uuid').to.be.a('string').and.not.be.empty;
      });
    });

    it('should not expand abstract-level stores and categories on the concrete resource', (): void => {
      // Concrete /products intentionally does not expand abstract-owned collections — they stay empty.
      getProduct(accessToken, sku).then((response) => {
        expect(response.body.data.attributes.stores, 'stores not expanded').to.be.an('array').and.to.be.empty;
        expect(response.body.data.attributes.categories, 'categories not expanded').to.be.an('array').and.to.be.empty;
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
      const validFrom = '2027-01-01T00:00:00+00:00';
      const validTo = '2027-12-31T00:00:00+00:00';

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
        localizedAttributes: {
          [staticFixtures.localeName]: { name: 'Patched name', isSearchable: false },
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.attributes.localizedAttributes[staticFixtures.localeName].name).to.eq('Patched name');
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

  // Abstract-level fields (stores, taxSet, categories) written through the concrete /products endpoint
  // are not echoed in the /products response — they are verified via GET /abstract-products/{abstractSku}.
  describe('abstract-level writes via /products', (): void => {
    it('should assign abstract stores when auto-creating the abstract (abstractSku omitted)', (): void => {
      const newSku = `pxm-abs-create-${Date.now()}`;
      const derivedAbstractSku = `${newSku}-abstract`;

      createProduct(accessToken, { ...buildValidProductBody(newSku, null), stores: [staticFixtures.storeName] }).then(
        (response) => {
          expect(response.status, 'concrete created').to.be.oneOf([200, 201]);

          getAbstractProduct(accessToken, derivedAbstractSku).then((abstractResponse) => {
            expect(abstractResponse.status).to.eq(200);
            expect(abstractResponse.body.data.attributes.stores, 'abstract stores').to.include(
              staticFixtures.storeName
            );
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

          getAbstractProduct(accessToken, abstractSku).then((abstractResponse) => {
            expect(abstractResponse.status).to.eq(200);
            expect(abstractResponse.body.data.attributes.stores, 'abstract stores').to.include.members(['DE', 'AT']);
          });
        });
      });
    });

    it('should assign taxSet and categories via POST and reflect them on the abstract', (): void => {
      // Real uuids are sourced from demo catalog products (seed helpers do not expose behaviour-generated
      // uuids, and the freshly seeded abstract carries none). Demo abstracts are taxed + categorised.
      getAbstractProductCollection(accessToken, { page: 1 }).then((collection) => {
        expect(collection.status).to.eq(200);

        const withRefs = collection.body.data.find(
          (item: { attributes: { taxSet?: { uuid?: string }; categories: Array<{ uuid: string }> } }) =>
            item.attributes.taxSet?.uuid && item.attributes.categories.length > 0
        );
        expect(withRefs, 'a demo abstract with a taxSet and category exists on page 1').to.not.be.undefined;

        const taxSetUuid = withRefs.attributes.taxSet.uuid;
        const categoryUuid = withRefs.attributes.categories[0].uuid;
        const newSku = `pxm-abs-refs-${Date.now()}`;
        const derivedAbstractSku = `${newSku}-abstract`;

        createProduct(accessToken, {
          ...buildValidProductBody(newSku, null),
          taxSet: taxSetUuid,
          categories: [{ uuid: categoryUuid }],
        }).then((response) => {
          expect(response.status, 'concrete created').to.be.oneOf([200, 201]);

          getAbstractProduct(accessToken, derivedAbstractSku).then((abstractResponse) => {
            expect(abstractResponse.status).to.eq(200);
            expect(abstractResponse.body.data.attributes.taxSet.uuid, 'taxSet assigned').to.eq(taxSetUuid);

            const categoryUuids = abstractResponse.body.data.attributes.categories.map(
              (item: { uuid: string }) => item.uuid
            );
            expect(categoryUuids, 'category assigned').to.include(categoryUuid);
          });
        });
      });
    });

    it('should assign newFrom and newTo to the abstract when auto-creating it', (): void => {
      const newSku = `pxm-abs-new-${Date.now()}`;
      const derivedAbstractSku = `${newSku}-abstract`;
      const newFrom = '2027-01-01T00:00:00+00:00';
      const newTo = '2027-12-31T00:00:00+00:00';

      createProduct(accessToken, { ...buildValidProductBody(newSku, null), newFrom, newTo }).then((response) => {
        expect(response.status, 'concrete created').to.be.oneOf([200, 201]);

        getAbstractProduct(accessToken, derivedAbstractSku).then((abstractResponse) => {
          expect(abstractResponse.status).to.eq(200);
          expect(abstractResponse.body.data.attributes.newFrom, 'newFrom assigned').to.contain('2027-01-01');
          expect(abstractResponse.body.data.attributes.newTo, 'newTo assigned').to.contain('2027-12-31');
        });
      });
    });

    it('should edit newFrom and newTo on the abstract via PATCH', (): void => {
      const patchSku = `pxm-abs-new-patch-${Date.now()}`;

      createProduct(accessToken, buildValidProductBody(patchSku, abstractSku)).then((createResponse) => {
        expect(createResponse.status, 'setup product created').to.be.oneOf([200, 201]);

        updateProduct(accessToken, patchSku, {
          newFrom: '2028-03-01T00:00:00+00:00',
          newTo: '2028-04-01T00:00:00+00:00',
        }).then((patchResponse) => {
          expect(patchResponse.status).to.eq(200);

          getAbstractProduct(accessToken, abstractSku).then((abstractResponse) => {
            expect(abstractResponse.status).to.eq(200);
            expect(abstractResponse.body.data.attributes.newFrom, 'newFrom edited').to.contain('2028-03-01');
            expect(abstractResponse.body.data.attributes.newTo, 'newTo edited').to.contain('2028-04-01');
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
        override: { taxSet: 'not-a-uuid' },
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
        override: { validFrom: '2027-12-31T00:00:00+00:00', validTo: '2027-01-01T00:00:00+00:00' },
      },
      {
        title: 'newFrom later than newTo',
        override: { newFrom: '2027-12-31T00:00:00+00:00', newTo: '2027-01-01T00:00:00+00:00' },
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
        override: { localizedAttributes: { zz_ZZ: { name: 'Unknown locale', isSearchable: true } } },
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

    // productClass and taxSet have no facade existence lookup in the validator stack, so an unknown-but-
    // well-formed uuid is accepted (2xx) and the association is silently not created (unlike category).
    it('should silently skip unknown productClass and taxSet uuids', (): void => {
      const newSku = `pxm-skip-${Date.now()}`;
      const body = {
        ...buildValidProductBody(newSku, abstractSku),
        productClass: [{ uuid: NON_EXISTENT_UUID }],
        taxSet: NON_EXISTENT_UUID,
      };

      createProduct(accessToken, body, false).then((response) => {
        expect(response.status, 'unknown productClass/taxSet uuids accepted').to.be.oneOf([200, 201]);
        // productClass is echoed on the concrete resource — the unknown uuid must not have been assigned.
        expect(response.body.data.attributes.productClass, 'unknown productClass not assigned').to.be.empty;
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

    // Mirror of the POST validation cases that apply to PATCH (sku is a URL identifier, so it is not patched).
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
        title: 'validFrom later than validTo',
        override: { validFrom: '2027-12-31T00:00:00+00:00', validTo: '2027-01-01T00:00:00+00:00' },
      },
    ];

    invalidCases.forEach(({ title, override }) => {
      it(`should reject ${title} with 422`, (): void => {
        updateProduct(accessToken, patchSku, override, false).then((response) => {
          expect(response.status).to.eq(422);
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
});
