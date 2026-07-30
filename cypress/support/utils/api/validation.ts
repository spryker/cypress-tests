/**
 * Glue API validation error code (`422 Unprocessable Entity`).
 */
export const API_VALIDATION_ERROR_CODE = '901';

type ApiErrorResponse = Cypress.Response<{ errors: Array<{ code?: string; detail: string }> }>;

/**
 * Asserts that the response carries an error with the given `detail` message.
 *
 * Asserts against the collected `detail` list rather than a boolean so a mismatch reports the
 * details the API actually returned instead of `expected false to be true`.
 */
export function expectApiErrorDetail(response: ApiErrorResponse, detail: string): void {
  const details = response.body.errors.map((error) => error.detail);

  // Serialized into the assertion message because Chai renders a list of long strings as `Array(n)`,
  // which hides the very details needed to tell a contract change from a broken expectation.
  expect(details, `response error details ${JSON.stringify(details)}`).to.include(detail);
}

/**
 * Asserts a `422` validation error with the shared validation code and the given `detail` message.
 */
export function expectApiValidationError(response: ApiErrorResponse, detail: string): void {
  expect(response.status).to.eq(422);

  const codes = response.body.errors.map((error) => `${error.code}`);

  expect(codes, 'response error codes').to.include(API_VALIDATION_ERROR_CODE);
  expectApiErrorDetail(response, detail);
}
