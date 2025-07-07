import { User } from './shared';

export interface ProductMeasurementUnitManagementStaticFixtures {
  defaultPassword: string;
}

export interface ProductMeasurementUnitManagementDynamicFixtures {
  rootUser: User;
  productMeasurementUnit: {
    code: string,
    name: string,
    conversionRate: number
  };
}
