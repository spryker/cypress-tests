import {ProductRepository} from "./product.repository";

export class ProductPage
{
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository)
    {
        this.productRepository = productRepository;
    }

    public addToCart(): void
    {
    }

    public addToWishlist(): void
    {
    }

    public addToShoppingList(): void
    {
    }
}
