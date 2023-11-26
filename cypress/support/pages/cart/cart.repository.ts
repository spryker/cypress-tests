export class CartRepository {
    getQuickAddToCartSkuField = () => {
        return cy.get('[name="sku"]');
    }

    getQuickAddToCartQuantityField = () => {
        return cy.get('#quantity');
    }

    getQuickAddToCartSubmitButton = () => {
        return cy.get('.js-product-quick-add-form__submit-button');
    }

    findCartItemRemovalForm = (sku: string) => {
        return cy.get('[action]').filter((index, element) => {
            // Construct a regex that includes the SKU
            const regex = new RegExp(`^/\\w+/cart/remove/${sku}/\\w+$`);
            return regex.test(element.getAttribute('action'));
        });
    }

    findCartItemChangeQuantityForm = (sku: string) => {
        return cy.get('[action]').filter((index, element) => {
            const regex = new RegExp(`^/\\w+/cart/change/${sku}$`);
            return regex.test(element.getAttribute('action'));
        });
    }

    getCartItemChangeQuantityField = (sku: string) => {
        return this.findCartItemChangeQuantityForm(sku)
            .find('[data-qa="component formatted-number-input"]');
    }

    findClearCartForm = () => {
        return cy.get('form[name=multi_cart_clear_form]');
    }

    getCheckoutButton = () => {
        return cy.get('[data-qa="cart-go-to-checkout"]');
    }
}
