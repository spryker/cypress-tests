import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

import { B2bRepository as B2bCartRepository } from '../pages/yves/cart/repositories/b2b-repository';
import { B2bRepository as B2bCommentCartRepository } from '../pages/yves/comment/cart/repositories/b2b-repository';

import { SuiteRepository as SuiteLoginRepository } from '../pages/yves/login/repositories/suite-repository';
import { SuiteRepository as SuiteCartRepository } from '../pages/yves/cart/repositories/suite-repository';
import { SuiteRepository as SuiteMultiCartRepository } from '../pages/yves/multi-cart/repositories/suite-repository';
import { SuiteRepository as SuiteCommentCartRepository } from '../pages/yves/comment/cart/repositories/suite-repository';
import { SuiteRepository as SuiteCheckoutCustomerRepository } from '../pages/yves/checkout/customer/repositories/suite-repository';
import { SuiteRepository as SuiteCheckoutAddressRepository } from '../pages/yves/checkout/address/repositories/suite-repository';
import { SuiteRepository as SuiteCheckoutShipmentRepository } from '../pages/yves/checkout/shipment/repositories/suite-repository';
import { SuiteRepository as SuiteCheckoutPaymentRepository } from '../pages/yves/checkout/payment/repositories/suite-repository';
import { SuiteRepository as SuiteCheckoutSummaryRepository } from '../pages/yves/checkout/summary/repositories/suite-repository';

/* eslint-disable @typescript-eslint/no-explicit-any */
type ClassConstructor = new (...args: any[]) => any;
type BindingsMap = { [key: string]: ClassConstructor };

function applyRepositoryBindings(bindings: BindingsMap) {
  for (const [type, implementation] of Object.entries(bindings)) {
    container.bind(type).to(implementation as ClassConstructor);
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const suiteMappings: BindingsMap = {
  [TYPES.LoginRepository]: SuiteLoginRepository,
  [TYPES.CartRepository]: SuiteCartRepository,
  [TYPES.MultiCartRepository]: SuiteMultiCartRepository,
  [TYPES.CommentCartRepository]: SuiteCommentCartRepository,
  [TYPES.CheckoutCustomerRepository]: SuiteCheckoutCustomerRepository,
  [TYPES.CheckoutAddressRepository]: SuiteCheckoutAddressRepository,
  [TYPES.CheckoutShipmentRepository]: SuiteCheckoutShipmentRepository,
  [TYPES.CheckoutPaymentRepository]: SuiteCheckoutPaymentRepository,
  [TYPES.CheckoutSummaryRepository]: SuiteCheckoutSummaryRepository,
};

const b2bMappings: BindingsMap = {
  [TYPES.CartRepository]: B2bCartRepository,
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

export { container };
