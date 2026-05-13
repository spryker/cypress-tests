import { User } from './shared';

export interface BackofficeCostCenterCrudStaticFixtures {
  defaultPassword: string;
  newCostCenterName: string;
  newCostCenterDescription: string;
  updatedCostCenterName: string;
}

export interface BackofficeCostCenterCrudDynamicFixtures {
  rootUser: User;
  company: { id_company: number; name: string };
  businessUnit: { id_company_business_unit: number; name: string };
  preExistingCostCenter: { id_cost_center: number; uuid: string; name: string };
}

export interface BackofficeBudgetCrudStaticFixtures {
  defaultPassword: string;
  newBudgetName: string;
  budgetAmount: string;
  budgetCurrency: string;
  budgetEnforcementRule: string;
  updatedBudgetName: string;
}

export interface BackofficeBudgetCrudDynamicFixtures {
  rootUser: User;
  costCenter: { id_cost_center: number; uuid: string; name: string };
  preExistingBudget: { id_budget: number; uuid: string; name: string };
}
