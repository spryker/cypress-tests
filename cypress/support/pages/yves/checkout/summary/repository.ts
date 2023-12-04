export class Repository {
  getaAcceptTermsAndConditionsCheckbox = () => {
    return cy.get('[name="acceptTermsAndConditions"]');
  };

  getSummaryForm = () => {
    return cy.get('form[name=summaryForm]');
  };
}
