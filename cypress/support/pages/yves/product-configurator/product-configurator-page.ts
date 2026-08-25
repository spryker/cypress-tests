import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { AbstractPage } from '../../abstract-page';
import { ProductConfiguratorRepository } from './product-configurator-repository';

// An option's label reads "<title> + <price>"; only the title reaches the shop's display data.
const OPTION_LABEL_PRICE_SEPARATOR = '+';

@injectable()
@autoWired
export class ProductConfiguratorPage extends AbstractPage {
  @inject(ProductConfiguratorRepository) private repository: ProductConfiguratorRepository;

  // The example configurator is its own application on a sibling host of the storefront. Cypress
  // follows the gateway's redirect into it in the same tab because both share the spryker.local
  // superdomain, so no cross-origin handling is needed.
  getHeading = (): Cypress.Chainable => this.repository.getHeading();

  getOptionTitle = (groupNumber: number, optionNumber: number): Cypress.Chainable<string> =>
    this.repository
      .getGroupOption(groupNumber, optionNumber)
      .find(this.repository.getOptionLabelSelector())
      .invoke('text')
      .then((label: string) => label.split(OPTION_LABEL_PRICE_SEPARATOR)[0].trim());

  // The radio is visually replaced by its tile, so the input the value lives on is covered.
  selectOption = (groupNumber: number, optionNumber: number): void => {
    this.repository
      .getGroupOption(groupNumber, optionNumber)
      .find(this.repository.getOptionInputSelector())
      .check({ force: true });
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}
