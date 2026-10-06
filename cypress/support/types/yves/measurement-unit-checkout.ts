import { Customer, ProductConcrete } from './shared';

export interface MeasurementUnitCheckoutStaticFixtures {
  defaultPassword: string;

  // Sales unit whose conversion is a whole base unit, and one whose conversion is not.
  wholeSalesUnit: SalesUnitQuantity;
  fractionalSalesUnit: SalesUnitQuantity;
}

interface SalesUnitQuantity {
  name: string;
  quantity: number;
}

export interface MeasurementUnitCheckoutDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
}
