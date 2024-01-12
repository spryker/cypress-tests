import { injectable } from 'inversify';
import { autoProvide } from '../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class CliHelper {
  private readonly store: string;
  private readonly containerPath: string;
  private readonly containerName: string;

  constructor() {
    this.store = Cypress.env().cli.store;
    this.containerPath = Cypress.env().cli.containerPath;
    this.containerName = Cypress.env().cli.containerName;
  }

  run = (command: string): void => {
    cy.exec(`docker ps -a -q -f name=${this.containerName}`).then((result) => {
      if (result.stdout) {
        cy.exec(`cd ${this.containerPath} && APPLICATION_STORE=${this.store} docker/sdk ${command}`);
      }
    });
  };
}
