import 'reflect-metadata';

import { Container, interfaces } from 'inversify';
import { REPOSITORIES } from './types';

import { SuiteAgentLoginRepository } from '../../pages/yves/agent-login/repositories/suite-agent-login-repository';
import { B2bCartRepository } from '../../pages/yves/cart/repositories/b2b-cart-repository';
import { SuiteCartRepository } from '../../pages/yves/cart/repositories/suite-cart-repository';
import { SuiteCheckoutAddressRepository } from '../../pages/yves/checkout/address/repositories/suite-checkout-address-repository';
import { SuiteCheckoutCustomerRepository } from '../../pages/yves/checkout/customer/repositories/suite-checkout-customer-repository';
import { SuiteCheckoutPaymentRepository } from '../../pages/yves/checkout/payment/repositories/suite-checkout-payment-repository';
import { SuiteCheckoutShipmentRepository } from '../../pages/yves/checkout/shipment/repositories/suite-checkout-shipment-repository';
import { SuiteCheckoutSummaryRepository } from '../../pages/yves/checkout/summary/repositories/suite-checkout-summary-repository';
import { B2bCommentCartRepository } from '../../pages/yves/comment/cart/repositories/b2b-comment-cart-repository';
import { SuiteCommentCartRepository } from '../../pages/yves/comment/cart/repositories/suite-comment-cart-repository';
import { B2bLoginRepository } from '../../pages/yves/login/repositories/b2b-login-repository';
import { SuiteLoginRepository } from '../../pages/yves/login/repositories/suite-login-repository';
import { B2bMultiCartRepository } from '../../pages/yves/multi-cart/repositories/b2b-multi-cart-repository';
import { SuiteMultiCartRepository } from '../../pages/yves/multi-cart/repositories/suite-multi-cart-repository';
import { SuiteCatalogRepository } from '../../pages/yves/catalog/repositories/suite-catalog-repository';
import { SuiteCompanyUserSelectRepository } from '../../pages/yves/company/user/select/repositories/suite-company-user-select-repository';
import { SuiteMerchantRelationRequestCreateRepository } from '../../pages/yves/company/merchant-relation-request/create/repositories/suite-merchant-relation-request-create-repository';
import { SuiteMerchantRelationRequestDetailsRepository } from '../../pages/yves/company/merchant-relation-request/details/repositories/suite-merchant-relation-request-details-repository';
import { SuiteMerchantRepository } from '../../pages/yves/merchant/repositories/suite-merchant-repository';
import { SuiteMerchantRelationRequestIndexRepository } from '../../pages/yves/company/merchant-relation-request/index/repositories/suite-merchant-relation-request-index-repository';
import { SuiteProductRepository } from '../../pages/yves/product/repositories/suite-product-repository';
import { B2bMpMerchantRepository } from '../../pages/yves/merchant/repositories/b2b-mp-merchant-repository';
import { B2bMpLoginRepository } from '../../pages/yves/login/repositories/b2b-mp-login-repository';
import { B2bMpCartRepository } from '../../pages/yves/cart/repositories/b2b-mp-cart-repository';
import { B2bMpCatalogRepository } from '../../pages/yves/catalog/repositories/b2b-mp-catalog-repository';
import { B2bMpProductRepository } from '../../pages/yves/product/repositories/b2b-mp-product-repository';
import { B2bMpCompanyUserSelectRepository } from '../../pages/yves/company/user/select/repositories/b2b-mp-company-user-select-repository';
import { B2bMpMerchantRelationRequestCreateRepository } from '../../pages/yves/company/merchant-relation-request/create/repositories/b2b-mp-merchant-relation-request-create-repository';
import { B2bMpMerchantRelationRequestDetailsRepository } from '../../pages/yves/company/merchant-relation-request/details/repositories/b2b-mp-merchant-relation-request-details-repository';
import { B2bMpMerchantRelationRequestIndexRepository } from '../../pages/yves/company/merchant-relation-request/index/repositories/b2b-mp-merchant-relation-request-index-repository';
import { B2cMpLoginRepository } from '../../pages/yves/login/repositories/b2c-mp-login-repository';
import { B2cMpAgentLoginRepository } from '../../pages/yves/agent-login/repositories/b2c-mp-agent-login-repository';
import { B2cMpCartRepository } from '../../pages/yves/cart/repositories/b2c-mp-cart-repository';
import { B2cMpCheckoutAddressRepository } from '../../pages/yves/checkout/address/repositories/b2c-mp-checkout-address-repository';
import { B2cMpCheckoutCustomerRepository } from '../../pages/yves/checkout/customer/repositories/b2c-mp-checkout-customer-repository';
import { B2cMpCheckoutPaymentRepository } from '../../pages/yves/checkout/payment/repositories/b2c-mp-checkout-payment-repository';
import { B2cMpCheckoutShipmentRepository } from '../../pages/yves/checkout/shipment/repositories/b2c-mp-checkout-shipment-repository';
import { B2cMpCheckoutSummaryRepository } from '../../pages/yves/checkout/summary/repositories/b2c-mp-checkout-summary-repository';
import { B2bMpAgentLoginRepository } from '../../pages/yves/agent-login/repositories/b2b-mp-agent-login-repository';
import { B2bMpCheckoutAddressRepository } from '../../pages/yves/checkout/address/repositories/b2b-mp-checkout-address-repository';
import { B2bMpCheckoutCustomerRepository } from '../../pages/yves/checkout/customer/repositories/b2b-mp-checkout-customer-repository';
import { B2bMpCheckoutPaymentRepository } from '../../pages/yves/checkout/payment/repositories/b2b-mp-checkout-payment-repository';
import { B2bMpCheckoutShipmentRepository } from '../../pages/yves/checkout/shipment/repositories/b2b-mp-checkout-shipment-repository';
import { B2bMpCheckoutSummaryRepository } from '../../pages/yves/checkout/summary/repositories/b2b-mp-checkout-summary-repository';
import { B2bMpMultiCartRepository } from '../../pages/yves/multi-cart/repositories/b2b-mp-multi-cart-repository';
import { B2bMpCommentCartRepository } from '../../pages/yves/comment/cart/repositories/b2b-mp-comment-cart-repository';
import { B2bCatalogRepository } from '../../pages/yves/catalog/repositories/b2b-catalog-repository';
import { B2bProductRepository } from '../../pages/yves/product/repositories/b2b-product-repository';
import { B2bCompanyUserSelectRepository } from '../../pages/yves/company/user/select/repositories/b2b-company-user-select-repository';
import { B2bMerchantRelationRequestCreateRepository } from '../../pages/yves/company/merchant-relation-request/create/repositories/b2b-merchant-relation-request-create-repository';
import { B2bMerchantRelationRequestDetailsRepository } from '../../pages/yves/company/merchant-relation-request/details/repositories/b2b-merchant-relation-request-details-repository';
import { B2bMerchantRelationRequestIndexRepository } from '../../pages/yves/company/merchant-relation-request/index/repositories/b2b-merchant-relation-request-index-repository';
import { B2bMerchantRepository } from '../../pages/yves/merchant/repositories/b2b-merchant-repository';

type BindingsMap = { [K in REPOSITORIES]?: interfaces.Newable<unknown> };

const suiteMappings: BindingsMap = {
  [REPOSITORIES.LoginRepository]: SuiteLoginRepository,
  [REPOSITORIES.CartRepository]: SuiteCartRepository,
  [REPOSITORIES.MultiCartRepository]: SuiteMultiCartRepository,
  [REPOSITORIES.CommentCartRepository]: SuiteCommentCartRepository,
  [REPOSITORIES.CheckoutCustomerRepository]: SuiteCheckoutCustomerRepository,
  [REPOSITORIES.CheckoutAddressRepository]: SuiteCheckoutAddressRepository,
  [REPOSITORIES.CheckoutShipmentRepository]: SuiteCheckoutShipmentRepository,
  [REPOSITORIES.CheckoutPaymentRepository]: SuiteCheckoutPaymentRepository,
  [REPOSITORIES.CheckoutSummaryRepository]: SuiteCheckoutSummaryRepository,
  [REPOSITORIES.AgentLoginRepository]: SuiteAgentLoginRepository,
  [REPOSITORIES.CatalogRepository]: SuiteCatalogRepository,
  [REPOSITORIES.ProductRepository]: SuiteProductRepository,
  [REPOSITORIES.CompanyUserSelectRepository]: SuiteCompanyUserSelectRepository,
  [REPOSITORIES.MerchantRelationRequestCreateRepository]: SuiteMerchantRelationRequestCreateRepository,
  [REPOSITORIES.MerchantRelationRequestDetailsRepository]: SuiteMerchantRelationRequestDetailsRepository,
  [REPOSITORIES.MerchantRelationRequestIndexRepository]: SuiteMerchantRelationRequestIndexRepository,
  [REPOSITORIES.MerchantRepository]: SuiteMerchantRepository,
};

const b2bMappings: BindingsMap = {
  [REPOSITORIES.LoginRepository]: B2bLoginRepository,
  [REPOSITORIES.CartRepository]: B2bCartRepository,
  [REPOSITORIES.MultiCartRepository]: B2bMultiCartRepository,
  [REPOSITORIES.CommentCartRepository]: B2bCommentCartRepository,
  [REPOSITORIES.CatalogRepository]: B2bCatalogRepository,
  [REPOSITORIES.ProductRepository]: B2bProductRepository,
  [REPOSITORIES.CompanyUserSelectRepository]: B2bCompanyUserSelectRepository,
  [REPOSITORIES.MerchantRelationRequestCreateRepository]: B2bMerchantRelationRequestCreateRepository,
  [REPOSITORIES.MerchantRelationRequestDetailsRepository]: B2bMerchantRelationRequestDetailsRepository,
  [REPOSITORIES.MerchantRelationRequestIndexRepository]: B2bMerchantRelationRequestIndexRepository,
  [REPOSITORIES.MerchantRepository]: B2bMerchantRepository,
};

const b2cMpMappings: BindingsMap = {
  [REPOSITORIES.LoginRepository]: B2cMpLoginRepository,
  [REPOSITORIES.AgentLoginRepository]: B2cMpAgentLoginRepository,
  [REPOSITORIES.CartRepository]: B2cMpCartRepository,
  [REPOSITORIES.CheckoutAddressRepository]: B2cMpCheckoutAddressRepository,
  [REPOSITORIES.CheckoutCustomerRepository]: B2cMpCheckoutCustomerRepository,
  [REPOSITORIES.CheckoutPaymentRepository]: B2cMpCheckoutPaymentRepository,
  [REPOSITORIES.CheckoutShipmentRepository]: B2cMpCheckoutShipmentRepository,
  [REPOSITORIES.CheckoutSummaryRepository]: B2cMpCheckoutSummaryRepository,
};

const b2bMpMappings: BindingsMap = {
  [REPOSITORIES.LoginRepository]: B2bMpLoginRepository,
  [REPOSITORIES.CartRepository]: B2bMpCartRepository,
  [REPOSITORIES.CatalogRepository]: B2bMpCatalogRepository,
  [REPOSITORIES.ProductRepository]: B2bMpProductRepository,
  [REPOSITORIES.CompanyUserSelectRepository]: B2bMpCompanyUserSelectRepository,
  [REPOSITORIES.MerchantRelationRequestCreateRepository]: B2bMpMerchantRelationRequestCreateRepository,
  [REPOSITORIES.MerchantRelationRequestDetailsRepository]: B2bMpMerchantRelationRequestDetailsRepository,
  [REPOSITORIES.MerchantRelationRequestIndexRepository]: B2bMpMerchantRelationRequestIndexRepository,
  [REPOSITORIES.MerchantRepository]: B2bMpMerchantRepository,
  [REPOSITORIES.AgentLoginRepository]: B2bMpAgentLoginRepository,
  [REPOSITORIES.CheckoutAddressRepository]: B2bMpCheckoutAddressRepository,
  [REPOSITORIES.CheckoutCustomerRepository]: B2bMpCheckoutCustomerRepository,
  [REPOSITORIES.CheckoutPaymentRepository]: B2bMpCheckoutPaymentRepository,
  [REPOSITORIES.CheckoutShipmentRepository]: B2bMpCheckoutShipmentRepository,
  [REPOSITORIES.CheckoutSummaryRepository]: B2bMpCheckoutSummaryRepository,
  [REPOSITORIES.MultiCartRepository]: B2bMpMultiCartRepository,
  [REPOSITORIES.CommentCartRepository]: B2bMpCommentCartRepository,
};

const container = new Container();
const repositoryId = Cypress.env('repositoryId');

if (repositoryId === 'suite') {
  applyRepositoryBindings(suiteMappings);
}
if (repositoryId === 'b2b') {
  applyRepositoryBindings(b2bMappings);
}
if (repositoryId === 'b2c-mp') {
  applyRepositoryBindings(b2cMpMappings);
}
if (repositoryId === 'b2b-mp') {
  applyRepositoryBindings(b2bMpMappings);
}

function applyRepositoryBindings(bindings: BindingsMap): void {
  for (const [type, implementation] of Object.entries(bindings)) {
    container.bind(type).to(implementation);
  }
}

export { container };
