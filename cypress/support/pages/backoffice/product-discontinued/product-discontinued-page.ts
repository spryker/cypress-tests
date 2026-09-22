import { autoWired } from '@utils';
import { injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class ProductDiscontinuedPage extends BackofficePage {
  protected PAGE_URL = '/product-discontinued-gui/index';

  // Driven by url rather than through the product table. The controller action is the whole of what
  // the back office does here, and a product created by a fixture is not reachable from the table
  // without paging through it, which is state this journey does not own.
  //
  // The action redirects by concatenating the Referer header, so without one it answers 500 *after*
  // having discontinued the product — a passing write behind a failing response.
  discontinueProduct = (params: DiscontinueProductParams): void => {
    const productListUrl = `${Cypress.env('backofficeUrl')}/product-management`;

    cy.visitBackoffice(`${this.PAGE_URL}/discontinue?id-product-concrete=${params.idProductConcrete}`, {
      headers: { referer: productListUrl },
    });
  };
}

interface DiscontinueProductParams {
  idProductConcrete: number;
}
