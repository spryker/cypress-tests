import { Customer, Product, User } from './shared';

export interface WarehousePickingOmsDynamicFixtures {
  rootUser: User;
  warehouseUser: User;
  customer: Customer;
  product: Product;
  salesOrder: { id_sales_order: number; order_reference: string };
}

export interface WarehousePickingOmsStaticFixtures {
  defaultPassword: string;
}
