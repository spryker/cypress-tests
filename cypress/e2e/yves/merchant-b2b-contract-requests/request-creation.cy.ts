import { container } from '@utils';
import {
  CatalogPage,
  CompanyUserSelectPage,
  MerchantPage,
  MerchantRelationRequestCreatePage,
  MerchantRelationRequestDetailsPage,
  MerchantRelationRequestIndexPage,
} from '../../../support/pages/yves';
import { CustomerLoginScenario } from '../../../support/scenarios/yves';
import { MerchantB2bContractRequestsStaticFixtures, RequestCreationDynamicFixtures } from '../../../support/types/yves';

/**
 * Merchant Relation Requests & Enhanced Merchant Relations checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4105896492/Business+Journey+B2B+Marketplace+-+to+automate}
 */
describe('request creation', { tags: ['@merchant-b2b-contract-requests'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
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

  it('company user should be able to create request from PDP', (): void => {
    companyUserSelectPage.selectBusinessUnit(dynamicFixtures.companyUser1FromCompany1.id_company_user);

    catalogPage.openFirstSuggestedProduct(dynamicFixtures.concreteProduct.abstract_sku);
    catalogPage.createMerchantRelationRequest(dynamicFixtures.productOfferFromMerchant2.product_offer_reference);

    merchantRelationRequestCreatePage.create({
      ownerBusinessUnitId: dynamicFixtures.businessUnit1FromCompany1.id_company_business_unit,
      businessUnitIds: [
        dynamicFixtures.businessUnit1FromCompany1.id_company_business_unit,
        dynamicFixtures.businessUnit2FromCompany1.id_company_business_unit,
      ],
    });

    merchantRelationRequestDetailsPage.assertPageLocation();
  });

  it('company user should not be able to create request from merchant profile without business units', (): void => {
    companyUserSelectPage.selectBusinessUnit(dynamicFixtures.companyUser2FromCompany1.id_company_user);

    cy.visit(dynamicFixtures.merchantUrl2.url);
    merchantPage.sendMerchantRelationRequest();

    merchantRelationRequestCreatePage.create({
      merchantReference: dynamicFixtures.merchant1.merchant_reference,
      ownerBusinessUnitId: dynamicFixtures.businessUnit2FromCompany1.id_company_business_unit,
      businessUnitIds: [],
    });

    merchantRelationRequestCreatePage.assertPageLocation();
  });

  it('company user should be able to create request from merchant profile page', (): void => {
    companyUserSelectPage.selectBusinessUnit(dynamicFixtures.companyUser2FromCompany1.id_company_user);

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

  it('company user should be able to create request from MR request create page', (): void => {
    companyUserSelectPage.selectBusinessUnit(dynamicFixtures.companyUser1FromCompany2.id_company_user);

    merchantRelationRequestIndexPage.visit();
    merchantRelationRequestIndexPage.createMerchantRelationRequest();

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
    companyUserSelectPage.selectBusinessUnit(dynamicFixtures.companyUser1FromCompany2.id_company_user);

    merchantRelationRequestCreatePage.visit();
    merchantRelationRequestCreatePage.create({
      merchantReference: dynamicFixtures.merchant1.merchant_reference,
      ownerBusinessUnitId: dynamicFixtures.businessUnit1FromCompany2.id_company_business_unit,
      businessUnitIds: [dynamicFixtures.businessUnit1FromCompany2.id_company_business_unit],
    });

    merchantRelationRequestDetailsPage.assertPageLocation();
  });

  it('sold by merchant contains MR request links', (): void => {
    companyUserSelectPage.selectBusinessUnit(dynamicFixtures.companyUser1FromCompany1.id_company_user);
    catalogPage.openFirstSuggestedProduct(dynamicFixtures.concreteProduct.abstract_sku);

    const productOffers = catalogPage.getSoldByProductOffers();
    const createRequestLink = catalogPage.getMerchantRelationRequestLinkAttribute();

    productOffers.children().each(($productOffer) => {
      const productOfferReference = $productOffer.find('input[type="radio"]').attr('value');

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
});
