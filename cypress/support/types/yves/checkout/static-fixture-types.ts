import {CheckoutByLoggedInCustomerDynamicFixtures} from "./dynamic-fixture-types";

export interface CheckoutByLoggedInCustomerStaticFixtures {
  customer: Customer;
}

interface Customer {
  password: string;
}
