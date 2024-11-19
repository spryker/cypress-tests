import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { CatalogPage } from '@pages/yves';

@injectable()
@autoWired
export class EnsureCatalogVisibilityScenario {
  // TODO: not used
  @inject(CatalogPage) private catalogPage: CatalogPage;

  execute(params: ExecuteParams = { attempts: 0, maxAttempts: 5, delay: 3000 }): void {
    this.catalogPage.visit();
    this.catalogPage.hasProductsInCatalog().then((isVisible) => {
      if (isVisible) {
        return;
      }

      if (params.attempts < params.maxAttempts) {
        cy.wait(params.delay);
        this.execute({ attempts: params.attempts + 1, maxAttempts: params.maxAttempts, delay: params.delay });
      }

      throw new Error('Catalog is not visible after maximum attempts');
    });
  }
}

interface ExecuteParams {
  attempts: number;
  maxAttempts: number;
  delay: number;
}
