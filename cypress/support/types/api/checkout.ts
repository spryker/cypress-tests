import { CartConfigurableProductPrice } from './cart';

export interface CheckoutConfigurableProductAddress {
  salutation: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  address3: string;
  zipCode: string;
  city: string;
  iso2Code: string;
  company: string;
  phone: string;
}

export interface CheckoutConfigurableProductStaticFixtures {
  defaultPassword: string;
  sku: string;
  merchantReference: string;
  store: string;
  currency: string;
  priceMode: string;
  configuratorKey: string;
  configuration: string;
  displayData: string;
  quantity: number;
  availableQuantity: number;
  idShipmentMethod: number;
  prices: CartConfigurableProductPrice[];
  payment: {
    paymentProviderName: string;
    paymentMethodName: string;
    paymentSelection: string;
  };
  address: CheckoutConfigurableProductAddress;
}

export interface CheckoutConfigurableProductDynamicFixtures {
  customer: {
    id_customer: number;
    email: string;
    salutation: string;
    first_name: string;
    last_name: string;
  };
}
