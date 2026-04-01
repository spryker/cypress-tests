import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductAttributeVisibilityRepository {
  getProductItemSelector = (): string => '[data-qa="component product-item"]';
  getAttributeBadgeSelector = (): string => '.badge.badge--hollow';
  getPdpAttributeSelector = (): string => '[itemprop="additionalProperty"]';
  getCartItemSelector = (): string => '[data-qa="component product-cart-item"]';
}
