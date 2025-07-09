import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductMeasurementUnitCreateRepository {
  getFormSubmitSelector = (): string => 'form[name="product_measurement_unit_form"] button[type="submit"]';

  getFormCodeFieldSelector = (): string => 'input[name="product_measurement_unit_form[code]"]';

  getFormNameFieldSelector = (): string => 'input[name="product_measurement_unit_form[name]"]';

  getFormDefaultPrecisionFieldSelector = (): string => 'input[name="product_measurement_unit_form[default_precision]"]';
}
