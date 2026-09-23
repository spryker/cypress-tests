import { injectable } from 'inversify';
import { SuiteCheckoutSummaryRecurringOrderRepository } from './suite-checkout-summary-recurring-order-repository';

/** The slice of the flatpickr instance the datepicker exposes on its trigger input. */
type FlatpickrTrigger = HTMLInputElement & {
  _flatpickr: {
    config: { minDate: Date };
    formatDate: (date: Date, format: string) => string;
  };
};

/**
 * The start date is rendered by the `date-time-picker` molecule instead of a native date input, so the
 * earliest selectable day comes from the flatpickr config and out-of-range input is discarded by the
 * widget rather than reported through HTML5 validity.
 */
@injectable()
export class B2bMpCheckoutSummaryRecurringOrderRepository extends SuiteCheckoutSummaryRecurringOrderRepository {
  getEarliestSelectableStartDate = (): Cypress.Chainable<string> =>
    this.getStartDateInput()
      .closest('date-time-picker')
      .find('.date-time-picker__datepicker-input')
      .then(($trigger): string => {
        const { config, formatDate } = ($trigger[0] as FlatpickrTrigger)._flatpickr;

        return formatDate(config.minDate, 'Y-m-d');
      });

  assertStartDateRejected = (): void => {
    this.getStartDateInput().blur().should('have.value', '');
  };
}
