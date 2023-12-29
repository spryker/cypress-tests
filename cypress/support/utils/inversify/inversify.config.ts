import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

import { B2bRepository as B2bCartRepository } from '../../pages/yves/cart/repositories/b2b-repository';
import { B2bRepository as B2bMultiCartRepository } from '../../pages/yves/multi-cart/repositories/b2b-repository';
import { B2bRepository as B2bCommentCartRepository } from '../../pages/yves/comment/cart/repositories/b2b-repository';

import { SuiteRepository as SuiteCartRepository } from '../../pages/yves/cart/repositories/suite-repository';
import { SuiteRepository as SuiteMultiCartRepository } from '../../pages/yves/multi-cart/repositories/suite-repository';
import { SuiteRepository as SuiteCommentCartRepository } from '../../pages/yves/comment/cart/repositories/suite-repository';
import { SuiteRepository as SuiteCheckoutCustomerRepository } from '../../pages/yves/checkout/customer/repositories/suite-repository';
import { SuiteRepository as SuiteCheckoutAddressRepository } from '../../pages/yves/checkout/address/repositories/suite-repository';
import { SuiteRepository as SuiteCheckoutShipmentRepository } from '../../pages/yves/checkout/shipment/repositories/suite-repository';
import { SuiteRepository as SuiteCheckoutPaymentRepository } from '../../pages/yves/checkout/payment/repositories/suite-repository';
import { SuiteRepository as SuiteCheckoutSummaryRepository } from '../../pages/yves/checkout/summary/repositories/suite-repository';
import { SuiteYvesAgentLoginRepository } from '../../pages/yves/agent-login/repositories/suite-yves-agent-login-repository';
import { SuiteYvesLoginRepository } from '../../pages/yves/login/repositories/suite-yves-login-repository';
import { B2bYvesLoginRepository } from '../../pages/yves/login/repositories/b2b-yves-login-repository';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassConstructor = new (...args: any[]) => any;
type BindingsMap = { [key: string]: ClassConstructor };

const suiteMappings: BindingsMap = {
  [TYPES.YvesLoginRepository]: SuiteYvesLoginRepository,
  [TYPES.CartRepository]: SuiteCartRepository,
  [TYPES.MultiCartRepository]: SuiteMultiCartRepository,
  [TYPES.CommentCartRepository]: SuiteCommentCartRepository,
  [TYPES.CheckoutCustomerRepository]: SuiteCheckoutCustomerRepository,
  [TYPES.CheckoutAddressRepository]: SuiteCheckoutAddressRepository,
  [TYPES.CheckoutShipmentRepository]: SuiteCheckoutShipmentRepository,
  [TYPES.CheckoutPaymentRepository]: SuiteCheckoutPaymentRepository,
  [TYPES.CheckoutSummaryRepository]: SuiteCheckoutSummaryRepository,
  [TYPES.LoginYvesAgentLoginRepository]: SuiteYvesAgentLoginRepository,
};

const b2bMappings: BindingsMap = {
  [TYPES.YvesLoginRepository]: B2bYvesLoginRepository,
  [TYPES.CartRepository]: B2bCartRepository,
  [TYPES.MultiCartRepository]: B2bMultiCartRepository,
  [TYPES.CommentCartRepository]: B2bCommentCartRepository,
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
