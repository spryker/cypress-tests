import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductOfferViewRepository } from './product-offer-view-repository';

@injectable()
@autoWired
export class ProductOfferViewPage extends BackofficePage {
  @inject(ProductOfferViewRepository) private repository: ProductOfferViewRepository;

  protected PAGE_URL = '/product-offer-gui/view';

  assertProductOfferData(param: ProductOffer): void {
    this.assertDetails(param);
    this.assertStores(param.stores);
    this.assertValidity(param);

    if (param.stocks && param.stocks.length > 0) {
      this.assertProductOfferStocks(param.stocks);
    }

    if (param.serviceTypeName) {
      this.assertService(param.serviceTypeName);
    }
  }

  assertProductOfferStocks(stocks: ProductOfferStock[]): void {
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

  private assertDetails(param: ProductOffer): void {
    this.repository.getApprovalStatusContainer().should('contain.text', param.approvalStatus);
    this.repository.getStatusContainer().should('contain.text', param.status);
    this.repository.getProductSkuContainer().should('contain.text', param.productSku);
    this.repository.getMerchantNameContainer().should('contain.text', param.merchantName);
  }

  private assertStores(stores: string[]): void {
    this.repository.getStoreContainer().should('have.length', stores.length);

    stores.forEach((store) => {
      this.repository.getStoreContainer().filter(`:contains("${store}")`).should('exist');
    });
  }

  private assertValidity(param: ProductOffer): void {
    const validFromText = param.validFrom ? param.validFrom : '--';
    this.repository.getValidFromContainer().should('contain.text', validFromText);

    const validToText = param.validTo ? param.validTo : '--';
    this.repository.getValidToContainer().should('contain.text', validToText);
  }

  private assertService(serviceTypeName: string): void {
    this.repository.getProductOfferServicePointContainer().should('contain.text', serviceTypeName);
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
  serviceTypeName?: string;
}

interface ProductOfferStock {
  name: string;
  storeName?: string;
  quantity: number;
  neverOutOfStock: boolean;
}
