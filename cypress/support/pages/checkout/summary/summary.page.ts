import { SummaryRepository } from "./summary.repository";
import { Page } from "../../shared/page";

export class SummaryPage extends Page {
    PAGE_URL = '/checkout/summary';
    repository: SummaryRepository;

    constructor() {
        super();
        this.repository = new SummaryRepository();
    }

    placeOrder = () => {
        this.repository.getaAcceptTermsAndConditionsCheckbox().check({force: true});
        this.repository.getSummaryForm().submit();
    };
}
