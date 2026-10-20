import { Address, Customer, Discount, ProductConcrete } from './shared';

export interface DiscountsAndPromotionsStaticFixtures {
  defaultPassword: string;
  // The B2C marketplace offers its invoice only for merchant items, which the fixture cart does not carry.
  paymentMethod: string;
}

export interface DiscountsAndPromotionsDynamicFixtures {
  customer: Customer;
  address: Address;
  promotionalProduct: ProductConcrete;
  voucherDiscount: Discount;
  cartRuleDiscount: Discount;
  promotionDiscount: Discount;
  voucherCode: DiscountVoucherCode;
  promotionVoucherCode: DiscountVoucherCode;
}

export interface DiscountVoucherCode {
  code: string;
}
