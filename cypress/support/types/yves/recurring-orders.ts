export interface CreateRecurringOrderStaticFixtures {
  defaultPassword: string;
  scheduleName: string;
}

export interface CreateRecurringOrderDynamicFixtures {
  buyer: { email: string; id_customer: number };
  buyerForCreditCard: { email: string; id_customer: number };
  buyerForStartDate: { email: string; id_customer: number };
  product: { sku: string; abstract_sku: string };
  quote: { id_quote: number };
  quoteForCreditCard: { id_quote: number };
  quoteForStartDate: { id_quote: number };
}

export interface ManageRecurringOrderStaticFixtures {
  defaultPassword: string;
  statuses: {
    active: string;
    paused: string;
    cancelled: string;
  };
  attentionBannerText: string;
  viewPausedFilterLabel: string;
  skippedHistoryStatus: string;
  editCadenceType: string;
  editCadenceLabel: string;
}

export interface ManageRecurringOrderDynamicFixtures {
  buyer: { email: string; id_customer: number };
  schedule: { id_recurring_schedule: number; uuid: string; name: string };
  pausedScheduleForBuyer: { id_recurring_schedule: number; uuid: string; name: string };
  cancelledScheduleForBuyer: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForSkip: { email: string; id_customer: number };
  scheduleForSkip: { id_recurring_schedule: number; uuid: string; name: string };
}

export interface RecurringOrderReviewStaticFixtures {
  defaultPassword: string;
}

export interface RecurringOrderReviewDynamicFixtures {
  buyer: { email: string; id_customer: number };
  schedule: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForBundle: { email: string; id_customer: number };
  scheduleForBundle: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForOffer: { email: string; id_customer: number };
  scheduleForOffer: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForConfigurableBundle: { email: string; id_customer: number };
  scheduleForConfigurableBundle: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForPriceDrift: { email: string; id_customer: number };
  scheduleForPriceDrift: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForStockDrift: { email: string; id_customer: number };
  scheduleForStockDrift: { id_recurring_schedule: number; uuid: string; name: string };
  stockDriftProduct: { sku: string; abstract_sku: string };
  simpleProductForStockDrift: { sku: string; abstract_sku: string };
  buyerForConfigurableProduct: { email: string; id_customer: number };
  scheduleForConfigurableProduct: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForPackagingUnit: { email: string; id_customer: number };
  scheduleForPackagingUnit: { id_recurring_schedule: number; uuid: string; name: string };
}

export interface RecurringOrderReviewNegativeStaticFixtures {
  defaultPassword: string;
  overStockQuantity: number;
  allItemsRemovedError: string;
  notAvailableError: string;
  budgetBlockError: string;
}

export interface RecurringOrderReviewNegativeDynamicFixtures {
  buyerForOverStock: { email: string; id_customer: number };
  scheduleForOverStock: { id_recurring_schedule: number; uuid: string; name: string };
  productForOverStock: { sku: string; abstract_sku: string };
  buyerForRemoveAll: { email: string; id_customer: number };
  scheduleForRemoveAll: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForUnavailable: { email: string; id_customer: number };
  scheduleForUnavailable: { id_recurring_schedule: number; uuid: string; name: string };
  productForUnavailable: { sku: string; abstract_sku: string };
  buyerForBudgetBlock: { email: string; id_customer: number };
  scheduleForBudgetBlock: { id_recurring_schedule: number; uuid: string; name: string };
}

export interface RecurringOrderReviewChangesStaticFixtures {
  defaultPassword: string;
  updatedQuantity: number;
}

export interface RecurringOrderReviewChangesDynamicFixtures {
  buyerForBudget: { email: string; id_customer: number };
  scheduleForBudget: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForQuantity: { email: string; id_customer: number };
  scheduleForQuantity: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForRemoval: { email: string; id_customer: number };
  scheduleForRemoval: { id_recurring_schedule: number; uuid: string; name: string };
  productFlaggedForRemoval: { sku: string; abstract_sku: string };
  buyerForSubstitute: { email: string; id_customer: number };
  scheduleForSubstitute: { id_recurring_schedule: number; uuid: string; name: string };
  discontinuedProduct: { sku: string; abstract_sku: string };
  substituteProduct: { sku: string; abstract_sku: string };
  buyerForAddProduct: { email: string; id_customer: number };
  scheduleForAddProduct: { id_recurring_schedule: number; uuid: string; name: string };
  addProduct: { sku: string; abstract_sku: string };
}
