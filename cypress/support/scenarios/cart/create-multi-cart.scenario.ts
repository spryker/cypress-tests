import { MultiCartPage } from "../../pages/multi-cart/multi.cart.page";

export class CreateMultiCartScenario {
    static execute = () => {
        const multiCartPage = new MultiCartPage();

        multiCartPage.createCart();
    }
}
