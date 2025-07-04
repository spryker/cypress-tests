import { User } from './shared';

export interface ProductMeasurementUnitManagementStaticFixtures {
  defaultPassword: string;
  rootUser: User;
}

export interface ProductMeasurementUnitManagementDynamicFixtures {
  productMeasurementUnit: {
    code: string,
    name: string,
    conversionRate: number
  };
}
