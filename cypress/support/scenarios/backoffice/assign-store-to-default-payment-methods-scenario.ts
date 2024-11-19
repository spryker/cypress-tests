import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { AssignStoreToPaymentMethodScenario } from '@scenarios/backoffice';

@injectable()
@autoWired
export class AssignStoreToDefaultPaymentMethodsScenario {
  @inject(AssignStoreToPaymentMethodScenario)
  private assignStoreToPaymentMethodScenario: AssignStoreToPaymentMethodScenario;

  DEFAULT_PAYMENT_METHODS = [
    {
      key: 'dummyMarketplacePaymentInvoice',
      name: 'Dummy Marketplace Payment',
    },
    {
      key: 'dummyPaymentInvoice',
      name: 'Dummy Payment',
    },
    {
      key: 'dummyPaymentCreditCard',
      name: 'Credit Card',
    },
  ];

  execute = (params: ExecuteParams): void => {
    this.DEFAULT_PAYMENT_METHODS.forEach((paymentMethod) => {
      this.assignStoreToPaymentMethodScenario.execute({
        storeName: params.storeName,
        paymentMethodName: paymentMethod.name,
        paymentMethodKey: paymentMethod.key,
        shouldTriggerPublishAndSync: params.shouldTriggerPublishAndSync,
      });
    });
  };
}

interface ExecuteParams {
  storeName: string;
  shouldTriggerPublishAndSync?: boolean;
}
