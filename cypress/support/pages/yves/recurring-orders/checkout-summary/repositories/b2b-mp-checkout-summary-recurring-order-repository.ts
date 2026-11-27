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
      // The date-time-picker chunk is lazy-loaded, so flatpickr attaches to the trigger after the input renders;
      // its() retries until the instance exists instead of reading it once.
      .its('0._flatpickr')
      .then((flatpickrInstance: FlatpickrTrigger['_flatpickr']): string => {
        const { config, formatDate } = flatpickrInstance;

        return formatDate(config.minDate, 'Y-m-d');
      });

  assertStartDateRejected = (): void => {
    this.getStartDateInput().blur().should('have.value', '');
  };
}
