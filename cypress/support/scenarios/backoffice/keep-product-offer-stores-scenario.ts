import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ProductOfferEditPage } from '@pages/backoffice';
import { OffersPage } from '@pages/mp';
import { MerchantUserLoginScenario } from '../mp/merchant-user-login-scenario';
import { UserLoginScenario } from './user-login-scenario';

@injectable()
@autoWired
export class KeepProductOfferStoresScenario {
  @inject(ProductOfferEditPage) private productOfferEditPage: ProductOfferEditPage;
  @inject(OffersPage) private offersPage: OffersPage;
  @inject(UserLoginScenario) private userLoginScenario: UserLoginScenario;
  @inject(MerchantUserLoginScenario) private merchantUserLoginScenario: MerchantUserLoginScenario;

  execute = (params: ExecuteParams): void => {
    // The B2C marketplace Back Office only views offers; their stores are edited by the merchant in the Merchant Portal.
    if (Cypress.env('repositoryId') === 'b2c-mp') {
      this.merchantUserLoginScenario.execute({ username: params.merchantUsername ?? '', password: params.password });
      this.offersPage.openOffer({ query: params.productOfferReference });
      this.offersPage.removeStores(params.storeNamesToRemove);
      this.offersPage.saveOffer();
    } else {
      this.userLoginScenario.execute({ username: params.backofficeUsername, password: params.password });
      this.productOfferEditPage.visitOffer(params.idProductOffer);
      this.productOfferEditPage.keepOnlyStores(params.storeNamesToKeep);
      this.productOfferEditPage.save();
    }

    cy.runQueueWorker();
  };
}

interface ExecuteParams {
  backofficeUsername: string;
  // Only the Merchant Portal path signs in as the merchant, so only the shops taking it seed one.
  merchantUsername?: string;
  password: string;
  idProductOffer: number;
  productOfferReference: string;
  storeNamesToKeep: string[];
  storeNamesToRemove: string[];
}
