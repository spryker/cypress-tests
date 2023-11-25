export class CartRepository
{
    public getQuickAddToCartSkuField()
    {
        return cy.get('[name="sku"]');
    }

    public getQuickAddToCartQuantityField()
    {
        return cy.get('#quantity');
    }

    public getQuickAddToCartSubmitButton()
    {
        return cy.get('.js-product-quick-add-form__submit-button');
    }

    public findCartItemRemovalForm(sku: string)
    {
        return cy.get('[action]').filter((index, element) => {
            // Construct a regex that includes the SKU
            const regex = new RegExp(`^/\\w+/cart/remove/${sku}/\\w+$`);
            return regex.test(element.getAttribute('action'));
        });
    }

    public findCartItemChangeQuantityForm(sku: string)
    {
        return cy.get('[action]').filter((index, element) => {
            // Construct a regex that includes the SKU
            const regex = new RegExp(`^/\\w+/cart/change/${sku}$`);
            return regex.test(element.getAttribute('action'));
        });
    }

    public findCartItemChangeQuantityButton(sku: string)
    {
        return cy.get('[data-qa="cart-item-change-quantity-submit"]').find(sku);
    }

    public findClearCartForm()
    {
        return cy.get('form[name=multi_cart_clear_form]');
    }

    public getCheckoutButton()
    {
        return cy.get('[data-qa="cart-go-to-checkout"]');
    }
}
