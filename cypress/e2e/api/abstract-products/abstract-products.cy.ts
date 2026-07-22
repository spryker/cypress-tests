import { AbstractProductsDynamicFixtures, AbstractProductsStaticFixtures } from '@interfaces/api';
import { getAbstractProduct, getAbstractProductCollection, getAbstractProductWithoutToken } from '@utils';
import { retryableBefore } from '../../../support/e2e';

// Non-nullable resource attributes always serialized (nullable ones — isActive, newFrom, newTo, taxSet — are omitted when null).
const EXPECTED_ATTRIBUTE_KEYS = [
  'sku',
  'attributes',
  'stores',
  'localizedAttributes',
  'prices',
  'imageSets',
  'categories',
  'superAttributeKeys',
];

describe('abstract products backend api', { tags: ['@api', '@abstract-products', 'product'] }, (): void => {
  let staticFixtures: AbstractProductsStaticFixtures;
  let dynamicFixtures: AbstractProductsDynamicFixtures;
  let accessToken: string;
  let abstractSku: string;

  retryableBefore((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
    abstractSku = dynamicFixtures.product.abstract_sku;
  });

  beforeEach((): void => {
    cy.getBackendApiToken().then((token) => {
      accessToken = token;
    });
  });

  describe('GET /abstract-products/{sku}', (): void => {
    it('should return the abstract product with core attributes', (): void => {
      getAbstractProduct(accessToken, abstractSku).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.type).to.eq('abstract-products');
        expect(response.body.data.id).to.eq(abstractSku);
        expect(response.body.data.attributes.sku).to.eq(abstractSku);
        expect(response.body.data.attributes).to.include.keys(EXPECTED_ATTRIBUTE_KEYS);
      });
    });

    it('should return the abstract product with all expanded relations', (): void => {
      getAbstractProduct(accessToken, abstractSku).then((response) => {
        const attributes = response.body.data.attributes;

        expect(attributes.stores, 'stores').to.include(staticFixtures.storeName);
        expect(attributes.localizedAttributes, 'localizedAttributes').to.be.an('object');

        const price = attributes.prices.find(
          (item: Record<string, unknown>) =>
            item.currencyCode === staticFixtures.currencyCode &&
            item.priceTypeName === staticFixtures.priceTypeName &&
            item.storeName === staticFixtures.storeName
        );
        expect(price, 'seeded price present').to.not.be.undefined;
        expect(price.netAmount).to.eq(staticFixtures.netAmount);
        expect(price.grossAmount).to.eq(staticFixtures.grossAmount);

        expect(attributes.imageSets, 'imageSets').to.be.an('array').and.to.have.length.greaterThan(0);
        expect(attributes.imageSets[0].images, 'images').to.have.length.greaterThan(0);

        expect(attributes.taxSet, 'taxSet').to.have.property('uuid');
        expect(attributes.taxSet).to.have.property('name');

        expect(attributes.categories, 'categories').to.be.an('array').and.to.have.length.greaterThan(0);
        expect(attributes.categories[0]).to.have.property('uuid');

        expect(attributes.superAttributeKeys, 'superAttributeKeys').to.include(staticFixtures.superAttributeKey);
      });
    });

    it('should return 404 for an unknown sku', (): void => {
      getAbstractProduct(accessToken, 'non-existent-abstract-sku', false).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should return 401 without an access token', (): void => {
      getAbstractProductWithoutToken(abstractSku).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });

  describe('GET /abstract-products', (): void => {
    it('should return a collection of abstract products', (): void => {
      getAbstractProductCollection(accessToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array').and.to.have.length.greaterThan(0);

        response.body.data.forEach((item: { id: string; type: string; attributes: { sku: string } }) => {
          expect(item.type).to.eq('abstract-products');
          expect(item.id).to.be.a('string');
          expect(item.attributes.sku).to.eq(item.id);
          expect(item.attributes).to.include.keys(EXPECTED_ATTRIBUTE_KEYS);
        });
      });
    });

    it('should respect the itemsPerPage limit and page parameter', (): void => {
      getAbstractProductCollection(accessToken, { page: 1 }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.length, 'page size <= itemsPerPage').to.be.at.most(10);
      });
    });

    it('should return a non-overlapping result set for page 2', (): void => {
      getAbstractProductCollection(accessToken, { page: 1 }).then((firstPage) => {
        expect(firstPage.status).to.eq(200);

        getAbstractProductCollection(accessToken, { page: 2 }).then((secondPage) => {
          expect(secondPage.status).to.eq(200);
          expect(secondPage.body.data.length, 'page 2 size <= itemsPerPage').to.be.at.most(10);

          const firstIds = firstPage.body.data.map((item: { id: string }) => item.id);
          const secondIds = secondPage.body.data.map((item: { id: string }) => item.id);
          secondIds.forEach((id: string) => expect(firstIds, 'no overlap between pages').to.not.include(id));
        });
      });
    });

    it('should return 401 without an access token', (): void => {
      getAbstractProductCollection('', {}, false).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });
});
