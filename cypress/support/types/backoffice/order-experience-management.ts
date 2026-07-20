import { User } from './shared';

export interface BackofficeRecurringScheduleStaticFixtures {
  defaultPassword: string;
  activeStatus: string;
  pausedStatus: string;
}

export interface BackofficeRecurringScheduleDynamicFixtures {
  rootUser: User;
  product: { sku: string; abstract_sku: string };
  activeSchedule: { id_recurring_schedule: number; uuid: string; name: string };
  pausedSchedule: { id_recurring_schedule: number; uuid: string; name: string };
}
