import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

import { B2bYvesMultiCartRepository } from '../../pages/yves/multi-cart/repositories/b2b-yves-multi-cart-repository';
import { B2bYvesCommentCartRepository } from '../../pages/yves/comment/cart/repositories/b2b-yves-comment-cart-repository';
import { SuiteYvesMultiCartRepository } from '../../pages/yves/multi-cart/repositories/suite-yves-multi-cart-repository';
import { SuiteYvesCommentCartRepository } from '../../pages/yves/comment/cart/repositories/suite-yves-comment-cart-repository';
import { SuiteYvesAgentLoginRepository } from '../../pages/yves/agent-login/repositories/suite-yves-agent-login-repository';
import { SuiteYvesLoginRepository } from '../../pages/yves/login/repositories/suite-yves-login-repository';
import { B2bYvesLoginRepository } from '../../pages/yves/login/repositories/b2b-yves-login-repository';
import { SuiteYvesCartRepository } from '../../pages/yves/cart/repositories/suite-yves-cart-repository';
import { SuiteYvesCheckoutCustomerRepository } from '../../pages/yves/checkout/customer/repositories/suite-yves-checkout-customer-repository';
import { SuiteYvesCheckoutAddressRepository } from '../../pages/yves/checkout/address/repositories/suite-yves-checkout-address-repository';
import { SuiteYvesCheckoutShipmentRepository } from '../../pages/yves/checkout/shipment/repositories/suite-yves-checkout-shipment-repository';
import { SuiteYvesCheckoutPaymentRepository } from '../../pages/yves/checkout/payment/repositories/suite-yves-checkout-payment-repository';
import { SuiteYvesCheckoutSummaryRepository } from '../../pages/yves/checkout/summary/repositories/suite-yves-checkout-summary-repository';
import { B2bYvesCartRepository } from '../../pages/yves/cart/repositories/b2b-yves-cart-repository';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassConstructor = new (...args: any[]) => any;
type BindingsMap = { [key: string]: ClassConstructor };

const suiteMappings: BindingsMap = {
  [TYPES.YvesLoginRepository]: SuiteYvesLoginRepository,
  [TYPES.YvesCartRepository]: SuiteYvesCartRepository,
  [TYPES.YvesMultiCartRepository]: SuiteYvesMultiCartRepository,
  [TYPES.YvesCommentCartRepository]: SuiteYvesCommentCartRepository,
  [TYPES.YvesCheckoutCustomerRepository]: SuiteYvesCheckoutCustomerRepository,
  [TYPES.YvesCheckoutAddressRepository]: SuiteYvesCheckoutAddressRepository,
  [TYPES.YvesCheckoutShipmentRepository]: SuiteYvesCheckoutShipmentRepository,
  [TYPES.YvesCheckoutPaymentRepository]: SuiteYvesCheckoutPaymentRepository,
  [TYPES.YvesCheckoutSummaryRepository]: SuiteYvesCheckoutSummaryRepository,
  [TYPES.YvesAgentLoginRepository]: SuiteYvesAgentLoginRepository,
};

const b2bMappings: BindingsMap = {
  [TYPES.YvesLoginRepository]: B2bYvesLoginRepository,
  [TYPES.YvesCartRepository]: B2bYvesCartRepository,
  [TYPES.YvesMultiCartRepository]: B2bYvesMultiCartRepository,
  [TYPES.YvesCommentCartRepository]: B2bYvesCommentCartRepository,
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
