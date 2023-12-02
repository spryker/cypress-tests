export class DetailRepository {
  getTriggerOmsDivSelector = () => {
    return '.col-md-12 > .row > .col-lg-12 > .ibox > .ibox-content';
  };

  getOmsButtonSelector = (action: string) => {
    return `button:contains("${action}")`;
  };

  getReturnButton = () => {
    return cy.get('.title-action').find('a:contains("Return")');
  };
}
