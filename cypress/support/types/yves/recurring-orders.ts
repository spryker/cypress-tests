export interface CreateRecurringOrderStaticFixtures {
  defaultPassword: string;
  scheduleName: string;
}

export interface CreateRecurringOrderDynamicFixtures {
  buyer: { email: string; id_customer: number };
  buyerForCreditCard: { email: string; id_customer: number };
  product: { sku: string; abstract_sku: string };
  quote: { id_quote: number };
  quoteForCreditCard: { id_quote: number };
}

export interface ManageRecurringOrderStaticFixtures {
  defaultPassword: string;
  resumeNextExecutionDate: string;
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
  buyerForBundleAndOffer: { email: string; id_customer: number };
  scheduleForBundleAndOffer: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForComplexProducts: { email: string; id_customer: number };
  scheduleForComplexProducts: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForPriceDrift: { email: string; id_customer: number };
  scheduleForPriceDrift: { id_recurring_schedule: number; uuid: string; name: string };
  buyerForStockDrift: { email: string; id_customer: number };
  scheduleForStockDrift: { id_recurring_schedule: number; uuid: string; name: string };
  stockDriftProduct: { sku: string; abstract_sku: string };
  simpleProductForStockDrift: { sku: string; abstract_sku: string };
}
