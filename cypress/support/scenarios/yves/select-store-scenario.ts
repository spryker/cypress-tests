import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class SelectStoreScenario {
  execute = (storeName: string): void => {
    cy.visit('/');
    cy.get('header [data-qa="component select _store"] select[name="_store"]').select('Store: ' + storeName);
  };
}
