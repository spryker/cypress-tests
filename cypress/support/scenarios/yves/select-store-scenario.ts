import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class SelectStoreScenario {
  execute = (store: string): void => {
    const url = `/?_store=${store}`;
    cy.visit(url);

    cy.url({ timeout: 4000 }).should('include', url);
  };
}
