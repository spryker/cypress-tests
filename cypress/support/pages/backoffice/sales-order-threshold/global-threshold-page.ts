import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '../backoffice-page';
import { GlobalThresholdRepository } from './global-threshold-repository';

// Every locale but the first renders inside a collapsed ibox, so its message input is in the DOM
// but not visible. Typing is forced rather than expanding each panel: the panels are decoration,
// and a message is required per locale for the threshold to save.
const FORCE_OPTIONS = { force: true } as const;

// The threshold messages carry {{threshold}} and {{fee}} placeholders, which Cypress would
// otherwise read as special-key sequences and refuse to type.
const TYPE_OPTIONS = { force: true, parseSpecialCharSequences: false } as const;

@injectable()
@autoWired
export class GlobalThresholdPage extends BackofficePage {
  @inject(GlobalThresholdRepository) private repository: GlobalThresholdRepository;

  protected PAGE_URL = '/sales-order-threshold-gui/global';

  applyThresholds = (thresholds: GlobalThresholds): void => {
    this.visit();
    this.repository.getStoreCurrencySelect().select(thresholds.storeCurrency, { force: true });

    this.fill(() => this.repository.getMinimumValueInput(), thresholds.minimumValue);
    this.fillLocalizedMessages((locale) => this.repository.getMinimumMessageInput(locale), thresholds.minimumMessage);

    this.fill(() => this.repository.getMaximumValueInput(), thresholds.maximumValue);
    this.fillLocalizedMessages((locale) => this.repository.getMaximumMessageInput(locale), thresholds.maximumMessage);

    if (thresholds.softStrategy) {
      this.repository.getSoftStrategyRadio(thresholds.softStrategy).check(FORCE_OPTIONS);
    }

    this.fill(() => this.repository.getSoftValueInput(), thresholds.softValue);
    this.fillLocalizedMessages((locale) => this.repository.getSoftMessageInput(locale), thresholds.softMessage);
    this.fill(() => this.repository.getSoftFixedFeeInput(), thresholds.softFixedFee);

    this.repository.getSubmitButton().click();
  };

  getSavedMessage = (): Cypress.Chainable => cy.contains(this.repository.getSuccessMessage());

  private fillLocalizedMessages = (
    inputOf: (locale: string) => Cypress.Chainable,
    message: string | undefined
  ): void => {
    if (message === undefined) {
      return;
    }

    LOCALES.forEach((locale: string): void => {
      inputOf(locale).clear(FORCE_OPTIONS);
      inputOf(locale).type(message, TYPE_OPTIONS);
    });
  };

  private fill = (inputOf: () => Cypress.Chainable, value: string | undefined): void => {
    if (value === undefined) {
      return;
    }

    inputOf().clear(FORCE_OPTIONS);

    if (value !== '') {
      inputOf().type(value, TYPE_OPTIONS);
    }
  };
}

const LOCALES = ['en_US', 'de_DE'];

export interface GlobalThresholds {
  storeCurrency: string;
  minimumValue?: string;
  minimumMessage?: string;
  maximumValue?: string;
  maximumMessage?: string;
  softStrategy?: string;
  softValue?: string;
  softMessage?: string;
  softFixedFee?: string;
}
