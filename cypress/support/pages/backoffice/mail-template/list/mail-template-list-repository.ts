import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MailTemplateListRepository {
  // The list has no data-qa hooks yet; the anchors and the js-* classes rendered by
  // Spryker\Zed\MailTemplate\Communication\Table\MailTemplateTable and Presentation/Index/index.twig
  // are the only stable handles. See the follow-up noted in the slice report.
  getTableBodySelector = (): string => 'table.gui-table-data tbody';
  getTableBody = (): Cypress.Chainable => cy.get(this.getTableBodySelector());
  getEditLinkSelector = (): string => 'a[href*="/mail-template/manage"]';
  getOverriddenOnlyCheckbox = (): Cypress.Chainable =>
    cy.get('form.js-mail-template-filter input[name="overridden-only"]');
}
