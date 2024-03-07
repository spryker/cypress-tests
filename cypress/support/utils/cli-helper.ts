import { injectable } from 'inversify';
import { autoWired } from './inversify';

@injectable()
@autoWired
export class CliHelper {
  run = (commands: string[]): void => {
    const operations = commands.map((command) => {
      return {
        type: 'cli-command',
        name: command,
      };
    });

    cy.request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: {
        data: {
          type: 'dynamic-fixtures',
          attributes: {
            operations: operations,
          },
        },
        timeout: 20000,
      },
    });
  };
}
