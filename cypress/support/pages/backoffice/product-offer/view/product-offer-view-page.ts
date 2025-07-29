import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductOfferViewRepository } from './product-offer-view-repository';
import { forEach } from 'cypress/types/lodash';

@injectable()
@autoWired
export class ProductOfferViewPage extends BackofficePage {
  @inject(ProductOfferViewRepository) private repository: ProductOfferViewRepository;

  protected PAGE_URL = '/product-offer-gui/view';

  verifyProductOfferData(param: ProductOffer): void {
    this.repository.getApprovalStatusContainer().should('contain.text', param.approvalStatus);
    this.repository.getStatusContainer().should('contain.text', param.status);

    this.repository.getStoreContainer().should('have.length', param.stores.length)

    param.stores.forEach((store) => {
      this.repository.getStoreContainer().filter(':contains("' + store + '")').should('exist');
    });

    this.repository.getProductSkuContainer().should('contain.text', param.productSku);
    this.repository.getMerchantNameContainer().should('contain.text', param.merchantName);
    if (param.validFrom) {
      this.repository.getValidFromContainer().should('contain.text', param.validFrom);
    } else {
      this.repository.getValidFromContainer().should('contain.text', '--');
    }
    if (param.validTo) {
      this.repository.getValidToContainer().should('contain.text', param.validTo);
    } else {
      this.repository.getValidToContainer().should('contain.text', '--');
    }

    if (param.stocks && param.stocks.length > 0) {
      this.verifyProductOfferStocks(param.stocks);
    }

    if (param.servicePoint) {
      this.repository.getProductOfferServicePointContainer().should('contain.text', param.servicePoint);
    }
  }

  verifyProductOfferStocks(stocks: ProductOfferStock[]): void {
    this.repository.getStockTableRows().should('have.length', stocks.length);

    stocks.forEach((stock, index) => {
      this.repository.getStockNameCell(index).should('contain.text', stock.name);
      if (stock.storeName) {
        this.repository.getStockNameCell(index).should('contain.text', stock.storeName);
      }

      this.repository.getStockQuantityCell(index).should('contain.text', stock.quantity);

      const expectedText = stock.neverOutOfStock ? 'Yes' : 'No';
      this.repository.getStockNeverOutOfStockCell(index).should('contain.text', expectedText);
    });
  }
}

interface ProductOffer {
  approvalStatus: string;
  status: string;
  stores: string[];
  productSku: string;
  merchantName: string;
  validFrom?: string;
  validTo?: string;
  stocks?: ProductOfferStock[];
  servicePoint?: string;
}

interface ProductOfferStock {
  name: string;
  storeName?: string;
  quantity: number;
  neverOutOfStock: boolean;
}
