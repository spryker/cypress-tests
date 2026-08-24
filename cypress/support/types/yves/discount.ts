import { Address, Customer, Discount, ProductConcrete, User } from './shared';

export interface DiscountsAndPromotionsStaticFixtures {
  defaultPassword: string;
}

export interface DiscountsAndPromotionsDynamicFixtures {
  rootUser: User;
  customer: Customer;
  address: Address;
  product: ProductConcrete;
  promotionalProduct: ProductConcrete;
  voucherDiscount: Discount;
  cartRuleDiscount: Discount;
  promotionDiscount: Discount;
  voucherCode: DiscountVoucherCode;
  guestVoucherCode: DiscountVoucherCode;
  productBundle: ProductConcrete;
}

export interface DiscountVoucherCode {
  code: string;
}
