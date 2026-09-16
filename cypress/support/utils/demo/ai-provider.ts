export function skipUnlessAiProviderEnabled(context: Mocha.Context): void {
  if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
    context.skip();
  }
}
