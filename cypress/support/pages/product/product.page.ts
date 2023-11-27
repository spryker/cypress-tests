import {ProductRepository} from "./product.repository";
import {Page} from "../shared/page";

export class ProductPage extends Page {
    repository: ProductRepository;

    constructor() {
        super();
        this.repository = new ProductRepository();
    }
}
