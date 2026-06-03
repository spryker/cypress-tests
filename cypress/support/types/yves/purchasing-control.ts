export interface YvesCostCenterCrudStaticFixtures {
  defaultPassword: string;
  newCostCenterName: string;
  newCostCenterDescription: string;
  updatedCostCenterName: string;
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
  newBudgetName: string;
  budgetAmount: string;
  budgetCurrency: string;
  budgetEnforcementRule: string;
  updatedBudgetName: string;
}

export interface YvesBudgetCrudDynamicFixtures {
  authorizedCustomer: { email: string };
  costCenter: { id_cost_center: number; uuid: string; name: string };
  preExistingBudget: { id_budget: number; uuid: string; name: string };
}

export interface BudgetEnforcementStaticFixtures {
  defaultPassword: string;
}

export interface BudgetEnforcementDynamicFixtures {
  buyerForWithin: { email: string };
  buyerForBlock: { email: string };
  buyerForWarn: { email: string };
  buyerForRequireApproval: { email: string };
  buyerForApproved: { email: string };
  approverCustomer: { email: string };
  approverCompanyUser: { id_company_user: number };
}
