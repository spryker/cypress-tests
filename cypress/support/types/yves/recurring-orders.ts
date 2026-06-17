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
  scheduleName: string;
  pausedScheduleName: string;
  cancelledScheduleName: string;
  skipScheduleName: string;
  resumeNextExecutionDate: string;
}

export interface ManageRecurringOrderDynamicFixtures {
  buyer: { email: string; id_customer: number };
  schedule: { id_recurring_schedule: number; uuid: string; name: string };
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
}
