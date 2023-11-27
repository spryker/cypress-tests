import {CartRepository} from "./cart.repository";
import {Page} from "../shared/page";

export class CartPage extends Page {
    PAGE_URL = '/cart';
    repository: CartRepository;

    constructor() {
        super();
        this.repository = new CartRepository();
    }

    quickAddToCart = (sku: string, quantity?: number) => {
        this.repository.getQuickAddToCartSkuField().then(elem => elem.val(sku));
        this.repository.getQuickAddToCartQuantityField().clear().type(String(quantity ?? 1));

        this.repository.getQuickAddToCartSubmitButton().click();
    }

    removeProduct = (sku: string) => {
        const form = this.repository.findCartItemRemovalForm(sku);

        if (!form) {
            return;
        }

        form.submit();
    }

    changeQuantity = (sku: string, newQuantity: number) => {
        let form = this.repository.findCartItemChangeQuantityForm(sku);
        let input = this.repository.getCartItemChangeQuantityField(sku);

        if (!form || !input) {
            return;
        }

        input.type('{selectall}').type(String(newQuantity));
        form.submit();
    }

    clearCart = () => {
        const form = this.repository.findClearCartForm();

        if (form) {
            form.submit();
        }
    }

    startCheckout = () => {
        this.repository.getCheckoutButton().click();
    }
}
