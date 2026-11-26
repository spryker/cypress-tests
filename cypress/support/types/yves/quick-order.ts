import { Address, Customer, Merchant, ProductConcrete, User } from './shared';

export interface QuickOrderToCheckoutDynamicFixtures {
  customer: Customer;
  reorderCustomer: Customer;
  reorderAddress: Address;
  shoppingList: QuickOrderShoppingList;
  product1: ProductConcrete;
  product2: ProductConcrete;
  merchant1: Merchant;
  merchant2: Merchant;
}

export interface QuickOrderToCheckoutStaticFixtures {
  defaultPassword: string;
  soldByText: string;
  firstProductQuantity: number;
  secondProductQuantity: number;
}

export interface QuickOrderVisualAddToCartDynamicFixtures {
  rootUser: User;
  customer: Customer;
}

export interface QuickOrderVisualAddToCartStaticFixtures {
  defaultPassword: string;
  visualAddToCartEnabledSettingKey: string;
  enabledSettingValue: string;
  pdfMimeType: string;
  pdfFormatName: string;
  invalidFileTypeMessage: string;
  textOrderFile: QuickOrderUploadedFile;
}

interface QuickOrderShoppingList {
  name: string;
}

interface QuickOrderUploadedFile {
  contents: string;
  fileName: string;
  mimeType: string;
}
