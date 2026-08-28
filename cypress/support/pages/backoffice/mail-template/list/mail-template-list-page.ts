import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { MailTemplateListRepository } from './mail-template-list-repository';

@injectable()
@autoWired
export class MailTemplateListPage extends BackofficePage {
  @inject(MailTemplateListRepository) private repository: MailTemplateListRepository;

  protected PAGE_URL = '/mail-template';

  protected TABLE_URL = '**/mail-template/index/table**';

  waitForTable = (): void => {
    cy.intercept('GET', this.TABLE_URL).as('mailTemplateTable');
    this.visit();
    cy.wait('@mailTemplateTable');
  };

  waitForOverriddenOnlyTable = (): void => {
    cy.intercept('GET', this.TABLE_URL).as('mailTemplateOverriddenOnlyTable');
    cy.visitBackoffice(`${this.PAGE_URL}?overridden-only=1`);
    cy.wait('@mailTemplateOverriddenOnlyTable');
  };

  getTableBody = (): Cypress.Chainable => this.repository.getTableBody();

  getOverriddenOnlyCheckbox = (): Cypress.Chainable => this.repository.getOverriddenOnlyCheckbox();

  clickEditForMailType = (mailType: string): void => {
    this.find({
      searchQuery: mailType,
      interceptTableUrl: this.TABLE_URL,
      expectedToSeeInTable: mailType,
    }).then((getRow) => {
      if (!getRow) {
        return;
      }

      getRow().find(this.repository.getEditLinkSelector()).first().click();
    });
  };
}
