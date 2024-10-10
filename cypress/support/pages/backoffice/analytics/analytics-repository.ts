import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AnalyticsRepository {
    getEnableAnalyticsButton = (): Cypress.Chainable => cy.get('a:contains("Enable Analytics")');
}
