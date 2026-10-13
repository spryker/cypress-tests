import { Address, Customer, Discount, ProductConcrete } from './shared';

export interface DiscountsAndPromotionsStaticFixtures {
  defaultPassword: string;
}

export interface DiscountsAndPromotionsDynamicFixtures {
  customer: Customer;
  address: Address;
  promotionalProduct: ProductConcrete;
  voucherDiscount: Discount;
  cartRuleDiscount: Discount;
  promotionDiscount: Discount;
  voucherCode: DiscountVoucherCode;
}

export interface DiscountVoucherCode {
  code: string;
}
