export function skipUnlessAiProviderEnabled(context: Mocha.Context): void {
  if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
    context.skip();
  }
}

export function skipUnlessAiKnowledgeBaseEnabled(context: Mocha.Context): void {
  if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED') || !Cypress.env('DEMO_AI_KNOWLEDGE_BASE_ENABLED')) {
    context.skip();
  }
}
