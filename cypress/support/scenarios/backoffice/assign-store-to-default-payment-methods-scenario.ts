import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { AssignStoreToPaymentMethodScenario } from '@scenarios/backoffice';

@injectable()
@autoWired
export class AssignStoreToPaymentMethodsScenario {
  @inject(AssignStoreToPaymentMethodScenario)
  private assignStoreToPaymentMethodScenario: AssignStoreToPaymentMethodScenario;

  execute = (params: ExecuteParams): void => {
    params.paymentMethods.forEach((paymentMethod) => {
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
  paymentMethods: PaymentMethod[];
  shouldTriggerPublishAndSync?: boolean;
}

interface PaymentMethod {
  key: string;
  name: string;
}
