import { MultiCartPage } from "../../pages/yves/multi-cart/multi.cart.page";

export class CreateMultiCartScenario {
    static execute = () => {
        const multiCartPage = new MultiCartPage();

        multiCartPage.createCart();
    }
}
