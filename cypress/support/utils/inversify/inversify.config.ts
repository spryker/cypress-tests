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
};

const container = new Container();
const repositoryId = Cypress.env('repositoryId');

if (repositoryId === 'suite') {
  applyRepositoryBindings(suiteMappings);
}
if (repositoryId === 'b2b') {
  applyRepositoryBindings(b2bMappings);
}

function applyRepositoryBindings(bindings: BindingsMap): void {
  for (const [type, implementation] of Object.entries(bindings)) {
    container.bind(type).to(implementation);
  }
}

export { container };
