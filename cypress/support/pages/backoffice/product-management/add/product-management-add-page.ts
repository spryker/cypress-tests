import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductManagementAddRepository } from './product-management-add-repository';

@injectable()
@autoWired
export class ProductManagementAddPage extends BackofficePage {
  @inject(ProductManagementAddRepository) private repository: ProductManagementAddRepository;

  protected PAGE_URL = '/product-management/add';

  create = (): ProductAbstract => {
    const productAbstract = {
      sku: this.faker.commerce.isbn(),
      name: this.faker.commerce.productName(),
      description: this.faker.commerce.productDescription(),
      price: this.faker.commerce.price(),
    };

    this.repository.getSkuPrefixInput().type(productAbstract.sku);
    this.repository.getProductNameDEInput().type(productAbstract.name);
    this.repository.getEnUsCollapsedBlock().click();
    this.repository.getProductDescriptionDEInput().type(productAbstract.description);
    this.repository.getProductNameENInput().type(productAbstract.name);
    this.repository.getProductDescriptionENInput().type(productAbstract.description);
    this.repository.getNewFromInput().type(this.getCurrentDate());
    this.repository.getNewToInput().type(this.getPlusOneMonthDate());

    this.repository.getPriceTaxTab().click();

    this.repository.getDefaultGrossPriceInput().type(productAbstract.price);
    this.repository.getOriginalGrossPriceInput().type(productAbstract.price);
    this.repository.getDefaultNetPriceInput().type(productAbstract.price);
    this.repository.getOriginalNetPriceInput().type(productAbstract.price);
    this.repository.getTaxSelect().select('Smart Electronics', { force: true });

    this.repository.getVariantsTab().click();

    this.repository.getVariantStorageCapacityCheckbox().click();
    this.repository.getVariantStorageCapacitySelect().select('16 GB', { force: true });

    this.repository.getImageTab().click();

    this.repository.getAddImageSetButton().first().click();
    this.repository.getImageSetName().type('Default');
    this.repository.getSmallImageUrlInput().type('https://images.icecat.biz/img/norm/medium/21713547-1700.jpg');
    this.repository.getLargeImageUrlInput().type('https://images.icecat.biz/img/norm/high/21713547-1700.jpg');

    this.repository.getSaveButton().click();

    return productAbstract;
  };

  private getCurrentDate = (): string => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };

  private getPlusOneMonthDate = (): string => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };
}

interface ProductAbstract {
  sku: string;
  name: string;
  description: string;
  price: string;
}
