/**
 * Glue API validation error code (`422 Unprocessable Entity`).
 */
export const API_VALIDATION_ERROR_CODE = '901';

type ApiErrorResponse = Cypress.Response<{ errors: Array<{ code?: string; detail: string }> }>;

/**
 * Asserts that the response carries an error with the given `detail` message.
 */
export function expectApiErrorDetail(response: ApiErrorResponse, detail: string): void {
  expect(response.body.errors.some((error) => error.detail === detail)).to.be.true;
}

/**
 * Asserts a `422` validation error with the shared validation code and the given `detail` message.
 */
export function expectApiValidationError(response: ApiErrorResponse, detail: string): void {
  expect(response.status).to.eq(422);
  expect(response.body.errors.some((error) => `${error.code}` === API_VALIDATION_ERROR_CODE)).to.be.true;
  expectApiErrorDetail(response, detail);
}
