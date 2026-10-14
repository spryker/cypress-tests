import { Customer } from './shared';

export interface ConfigurableBundleCheckoutDynamicFixtures {
  customer: Customer;
}

export interface ConfigurableBundleCheckoutStaticFixtures {
  defaultPassword: string;
  templateName: string;
  firstConfiguration: BundleSlotSelection[];
  secondConfiguration: BundleSlotSelection[];
}

export interface BundleSlotSelection {
  slotName: string;
  productIdentifier: string;
}
