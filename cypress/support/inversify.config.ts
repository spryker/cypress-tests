import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { Page as CartPage } from './pages/yves/cart/page';
import { Page as CommentCartPage } from './pages/yves/comment/cart/page';
import { Repository as CartRepository } from './pages/yves/cart/repository';
import { Repository as CommentCartRepository } from './pages/yves/comment/cart/repository';
import { B2bRepository as B2bCartRepository } from './pages/yves/cart/repositories/b2b-repository';
import { B2bRepository as B2bCommentCartRepository } from './pages/yves/comment/cart/repositories/b2b-repository';
import { SuiteRepository as SuiteCartRepository } from './pages/yves/cart/repositories/suite-repository';
import { SuiteRepository as SuiteCommentCartRepository } from './pages/yves/comment/cart/repositories/suite-repository';

const container = new Container();

// ====> Binding Pages <====
container.bind<CartPage>(CartPage).toSelf();
container.bind<CommentCartPage>(CommentCartPage).toSelf();

// ====> Binding Suite Repositories <====
if (Cypress.env('projectName') === 'suite') {
  container.bind<CartRepository>(TYPES.CartRepository).to(SuiteCartRepository);
  container
    .bind<CommentCartRepository>(TYPES.CommentCartRepository)
    .to(SuiteCommentCartRepository);
}

// ====> Binding B2B Repositories <====
if (Cypress.env('projectName') === 'b2b') {
  container.bind<CartRepository>(TYPES.CartRepository).to(B2bCartRepository);
  container
    .bind<CommentCartRepository>(TYPES.CommentCartRepository)
    .to(B2bCommentCartRepository);
}

export { container };
