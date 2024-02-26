import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

import { B2bMultiCartRepository } from '../../pages/yves/multi-cart/repositories/b2b-multi-cart-repository';
import { B2bCommentCartRepository } from '../../pages/yves/comment/cart/repositories/b2b-comment-cart-repository';
import { SuiteMultiCartRepository } from '../../pages/yves/multi-cart/repositories/suite-multi-cart-repository';
import { SuiteCommentCartRepository } from '../../pages/yves/comment/cart/repositories/suite-comment-cart-repository';
import { SuiteAgentLoginRepository } from '../../pages/yves/agent-login/repositories/suite-agent-login-repository';
import { SuiteLoginRepository } from '../../pages/yves/login/repositories/suite-login-repository';
import { B2bLoginRepository } from '../../pages/yves/login/repositories/b2b-login-repository';
import { SuiteCartRepository } from '../../pages/yves/cart/repositories/suite-cart-repository';
import { SuiteCheckoutCustomerRepository } from '../../pages/yves/checkout/customer/repositories/suite-checkout-customer-repository';
import { SuiteCheckoutAddressRepository } from '../../pages/yves/checkout/address/repositories/suite-checkout-address-repository';
import { SuiteCheckoutShipmentRepository } from '../../pages/yves/checkout/shipment/repositories/suite-checkout-shipment-repository';
import { SuiteCheckoutPaymentRepository } from '../../pages/yves/checkout/payment/repositories/suite-checkout-payment-repository';
import { SuiteCheckoutSummaryRepository } from '../../pages/yves/checkout/summary/repositories/suite-checkout-summary-repository';
import { B2bCartRepository } from '../../pages/yves/cart/repositories/b2b-cart-repository';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassConstructor = new (...args: any[]) => any;
type BindingsMap = { [key: string]: ClassConstructor };

const suiteMappings: BindingsMap = {
  [TYPES.YvesLoginRepository]: SuiteLoginRepository,
  [TYPES.YvesCartRepository]: SuiteCartRepository,
  [TYPES.YvesMultiCartRepository]: SuiteMultiCartRepository,
  [TYPES.YvesCommentCartRepository]: SuiteCommentCartRepository,
  [TYPES.YvesCheckoutCustomerRepository]: SuiteCheckoutCustomerRepository,
  [TYPES.YvesCheckoutAddressRepository]: SuiteCheckoutAddressRepository,
  [TYPES.YvesCheckoutShipmentRepository]: SuiteCheckoutShipmentRepository,
  [TYPES.YvesCheckoutPaymentRepository]: SuiteCheckoutPaymentRepository,
  [TYPES.YvesCheckoutSummaryRepository]: SuiteCheckoutSummaryRepository,
  [TYPES.YvesAgentLoginRepository]: SuiteAgentLoginRepository,
};

const b2bMappings: BindingsMap = {
  [TYPES.YvesLoginRepository]: B2bLoginRepository,
  [TYPES.YvesCartRepository]: B2bCartRepository,
  [TYPES.YvesMultiCartRepository]: B2bMultiCartRepository,
  [TYPES.YvesCommentCartRepository]: B2bCommentCartRepository,
};

const container = new Container();
const repositoryId = Cypress.env('repositoryId');

if (repositoryId === 'suite') {
  applyRepositoryBindings(suiteMappings);
}
if (repositoryId === 'b2b') {
  applyRepositoryBindings(b2bMappings);
}

function applyRepositoryBindings(bindings: BindingsMap) {
  for (const [type, implementation] of Object.entries(bindings)) {
    container.bind(type).to(implementation as ClassConstructor);
  }
}

export { container };
