import { container } from '@utils';
import { MerchantB2bContractRequestsStaticFixtures, RequestCreationDynamicFixtures } from '@interfaces/yves';
import {
  CatalogPage,
  CompanyUserSelectPage,
  MerchantPage,
  MerchantRelationRequestCreatePage,
  MerchantRelationRequestDetailsPage,
  MerchantRelationRequestIndexPage,
  ProductPage,
} from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

/**
 * Merchant Relation Requests & Enhanced Merchant Relations checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4105896492/Business+Journey+B2B+Marketplace+-+to+automate}
 */
(['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'request creation',
  { tags: ['@yves', '@merchant-b2b-contract-requests', 'marketplace-merchant-contracts', 'merchant-contracts', 'merchant-contract-requests', 'marketplace-merchant', 'product', 'marketplace-product', 'marketplace-merchant-portal-product-management', 'marketplace-merchantportal-core', 'spryker-core'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const companyUserSelectPage = container.get(CompanyUserSelectPage);
    const merchantRelationRequestCreatePage = container.get(MerchantRelationRequestCreatePage);
    const merchantRelationRequestDetailsPage = container.get(MerchantRelationRequestDetailsPage);
    const merchantRelationRequestIndexPage = container.get(MerchantRelationRequestIndexPage);
    const merchantPage = container.get(MerchantPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let dynamicFixtures: RequestCreationDynamicFixtures;
    let staticFixtures: MerchantB2bContractRequestsStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      companyUserSelectPage.visit();
    });

    skipB2BIt('company user should be able to create request from PDP', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser1FromCompany1.id_company_user,
      });

      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.concreteProduct.abstract_sku });
      productPage.createMerchantRelationRequest({
        productOfferReference: dynamicFixtures.productOfferFromMerchant2.product_offer_reference,
      });

      merchantRelationRequestCreatePage.create({
        ownerBusinessUnitId: dynamicFixtures.businessUnit1FromCompany1.id_company_business_unit,
        businessUnitIds: [
          dynamicFixtures.businessUnit1FromCompany1.id_company_business_unit,
          dynamicFixtures.businessUnit2FromCompany1.id_company_business_unit,
        ],
      });

      merchantRelationRequestDetailsPage.assertPageLocation();
    });

    skipB2BIt('company user should be able to create request from merchant profile page', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser2FromCompany1.id_company_user,
      });

      cy.visit(dynamicFixtures.merchantUrl2.url);
      merchantPage.sendMerchantRelationRequest();

      merchantRelationRequestCreatePage.create({
        ownerBusinessUnitId: dynamicFixtures.businessUnit2FromCompany1.id_company_business_unit,
        businessUnitIds: [
          dynamicFixtures.businessUnit1FromCompany1.id_company_business_unit,
          dynamicFixtures.businessUnit2FromCompany1.id_company_business_unit,
        ],
      });

      merchantRelationRequestDetailsPage.assertPageLocation();
    });

    it('company user should not be able to create request without business units', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser2FromCompany1.id_company_user,
      });

      merchantRelationRequestIndexPage.visit();
      merchantRelationRequestIndexPage.create();

      merchantRelationRequestCreatePage.create({
        merchantReference: dynamicFixtures.merchant1.merchant_reference,
        ownerBusinessUnitId: dynamicFixtures.businessUnit2FromCompany1.id_company_business_unit,
        businessUnitIds: [],
      });

      merchantRelationRequestCreatePage.assertPageLocation();
    });

    it('company user should be able to create request from MR request create page', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser1FromCompany2.id_company_user,
      });

      merchantRelationRequestIndexPage.visit();
      merchantRelationRequestIndexPage.create();

      merchantRelationRequestCreatePage.create({
        merchantReference: dynamicFixtures.merchant1.merchant_reference,
        ownerBusinessUnitId: dynamicFixtures.businessUnit1FromCompany2.id_company_business_unit,
        businessUnitIds: [
          dynamicFixtures.businessUnit1FromCompany2.id_company_business_unit,
          dynamicFixtures.businessUnit2FromCompany2.id_company_business_unit,
        ],
      });

      merchantRelationRequestDetailsPage.assertPageLocation();
    });

    it('company user should be able to create request with only one business unit', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser1FromCompany2.id_company_user,
      });

      merchantRelationRequestCreatePage.visit();
      merchantRelationRequestCreatePage.create({
        merchantReference: dynamicFixtures.merchant1.merchant_reference,
        ownerBusinessUnitId: dynamicFixtures.businessUnit1FromCompany2.id_company_business_unit,
        businessUnitIds: [dynamicFixtures.businessUnit1FromCompany2.id_company_business_unit],
      });

      merchantRelationRequestDetailsPage.assertPageLocation();
    });

    skipB2BIt('sold by merchant contains MR request links', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser1FromCompany1.id_company_user,
      });
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.concreteProduct.abstract_sku });

      const productOffers = productPage.getSoldByProductOffers();
      const createRequestLink = productPage.getMerchantRelationRequestLinkAttribute();

      productOffers.children().each(($productOffer) => {
        const productOfferReference = $productOffer.find(productPage.getInputRadioSelector()).attr('value');

        if (
          productOfferReference === dynamicFixtures.productOfferFromMerchant1.product_offer_reference ||
          productOfferReference === dynamicFixtures.productOfferFromMerchant2.product_offer_reference
        ) {
          cy.wrap($productOffer).find(createRequestLink).should('exist');
        } else if (productOfferReference === dynamicFixtures.productOfferFromMerchant3.product_offer_reference) {
          cy.wrap($productOffer).find(createRequestLink).should('not.exist');
        }
      });
    });

    function skipB2BIt(description: string, testFn: () => void): void {
      (Cypress.env('repositoryId') === 'b2b' ? it.skip : it)(description, testFn);
    }
  }
);
