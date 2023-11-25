import {CartRepository} from "./cart.repository";

export class CartPage
{
    private cartRepository: CartRepository;

    constructor()
    {
        this.cartRepository = new CartRepository();
    }

    public quickAddToCart(sku: string, quantity?: number): void
    {
        this.cartRepository.getQuickAddToCartSkuField().then(elem => elem.val(sku));
        this.cartRepository.getQuickAddToCartQuantityField().clear().type(String(quantity ?? 1));

        this.cartRepository.getQuickAddToCartSubmitButton().click();
    }

    public removeProduct(sku: string): void
    {
        const form = this.cartRepository.findCartItemRemovalForm(sku);

        if (!form) {
            return;
        }

        form.submit();
    }

    public changeQuantity(sku: string, newQuantity: number): void
    {
        let form = this.cartRepository.findCartItemChangeQuantityForm(sku);

        if (!form) {
            return;
        }

        form.find('[data-qa="component formatted-number-input"]').type('{selectall}').type(String(newQuantity));
        this.cartRepository.findCartItemChangeQuantityForm(sku).submit();
    }

    public clearCart(): void
    {
        const form = this.cartRepository.findClearCartForm();

        if (form) {
            form.submit();
        }
    }

    public checkout(): void
    {
        this.cartRepository.getCheckoutButton().click();
    }
}
