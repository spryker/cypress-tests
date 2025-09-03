import { User } from './shared';

export interface ServiceListStaticFixtures {
  defaultPassword: string;
}

export interface ServiceListDynamicFixtures {
  rootUser: User;
  businessUnit: BusinessUnit;
  company: Company;
  customer: Customer;
  serviceProduct: Product;
  salesOrder: SalesOrder;
}

interface Company {
  id_company: number;
  name: string;
  isActive: boolean;
  status: string;
}

interface BusinessUnit {
  id_company_business_unit: number;
  name: string;
  fkCompany: number;
}

interface Customer {
  id_customer: number;
  first_name: string;
  last_name: string;
  email: string;
  customer_reference: string;
}

export interface CompanyUser {
  id_company_user: number;
  fkCompany: number;
  fkCompanyBusinessUnit: number;
  fkCustomer: number;
}

export interface ProductClass {
  id_product_class: number;
  key: string;
  name: string;
}

export interface Product {
  id_product_concrete: number;
  sku: string;
  name: string;
  description: string;
}

export interface ShipmentType {
  id_shipment_type: number;
  uuid: string;
  key: string;
  name: string;
}

export interface ShipmentMethod {
  id_shipment_method: number;
  key: string;
  name: string;
}

export interface Address {
  id_customer_address: number;
  address1: string;
  address2: string;
  zipCode: string;
  city: string;
  iso2Code: string;
  fkCustomer: number;
}

export interface Shipment {
  id_shipment: number;
  shipmentTypeUuid: string;
  idShipmentMethod: number;
  method: ShipmentMethod;
  shippingAddress: Address;
}

export interface SalesOrder {
  id_sales_order: number;
  order_reference: string;
  customerReference: string;
  item: OrderItem;
  shipment: Shipment;
  billingAddress: Address;
  shippingAddress: Address;
  order_items: OrderItem[];
}

export interface OrderItem {
  id_sales_order_item: number;
  sku: string;
  quantity: number;
  unitPrice: number;
  name: string;
}
