export interface YvesCostCenterCrudStaticFixtures {
  defaultPassword: string;
}

export interface YvesCostCenterCrudDynamicFixtures {
  authorizedCustomer: { email: string };
  unauthorizedCustomer: { email: string };
  businessUnit: { id_company_business_unit: number; name: string };
  preExistingCostCenter: { id_cost_center: number; uuid: string; name: string };
  inactiveCostCenter: { id_cost_center: number; uuid: string; name: string };
}

export interface YvesBudgetCrudStaticFixtures {
  defaultPassword: string;
}

export interface YvesBudgetCrudDynamicFixtures {
  authorizedCustomer: { email: string };
  costCenter: { id_cost_center: number; uuid: string; name: string };
  preExistingBudget: { id_budget: number; uuid: string; name: string };
}
