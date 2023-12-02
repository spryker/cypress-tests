export class SummaryRepository {
  getaAcceptTermsAndConditionsCheckbox = () => {
    return cy.get('[name="acceptTermsAndConditions"]');
  };

  getSummaryForm = () => {
    return cy.get('form[name=summaryForm]');
  };
}
