import { DetailRepository } from './detail.repository';
import { Page } from '../../../page';

export class DetailPage extends Page {
  PAGE_URL = '/sales/detail';
  repository: DetailRepository;

  constructor() {
    super();
    this.repository = new DetailRepository();
  }

  triggerOms = (state: string) => {
    cy.url().then((url) => {
      cy.reloadUntilFound(
        url,
        this.repository.getOmsButtonSelector(state),
        this.repository.getTriggerOmsDivSelector(),
        30,
        2000
      );

      cy.get(this.repository.getTriggerOmsDivSelector())
        .find(this.repository.getOmsButtonSelector(state))
        .click();
    });
  };

  createReturn = () => {
    this.repository.getReturnButton().click();
  };
}
