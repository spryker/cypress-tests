import { CartConfigurableProductPrice } from './cart';

export interface ShoppingListConfigurableProductStaticFixtures {
  defaultPassword: string;
  shoppingListName: string;
  configuratorKey: string;
  configuration: string;
  displayData: string;
  quantity: number;
  availableQuantity: number;
  prices: CartConfigurableProductPrice[];
}

export interface ShoppingListConfigurableProductDynamicFixtures {
  customer: {
    id_customer: number;
    email: string;
  };
  configurableProduct: {
    sku: string;
    idProductConcrete: number;
  };
  regularProduct: {
    sku: string;
  };
}
