/**
 * Glue API validation error code (`422 Unprocessable Entity`).
 */
export const API_VALIDATION_ERROR_CODE = '901';

type ApiErrorResponse = Cypress.Response<{ errors: Array<{ code?: string; detail: string }> }>;

function expectApiValidationResponse(response: ApiErrorResponse): void {
  expect(response.status).to.eq(422);

  const codes = response.body.errors.map((error) => `${error.code}`);

  expect(codes, 'response error codes').to.include(API_VALIDATION_ERROR_CODE);
}

/**
 * Asserts that the response carries an error with the given `detail` message.
 */
export function expectApiErrorDetail(response: ApiErrorResponse, detail: string): void {
  const details = response.body.errors.map((error) => error.detail);

  // Serialized into the message because Chai renders a list of long strings as `Array(n)`.
  expect(details, `response error details ${JSON.stringify(details)}`).to.include(detail);
}

/**
 * Asserts a `422` validation error with the shared validation code and the given `detail` message.
 */
export function expectApiValidationError(response: ApiErrorResponse, detail: string): void {
  expectApiValidationResponse(response);
  expectApiErrorDetail(response, detail);
}

/**
 * Asserts a `422` validation error whose details match one of the accepted sets in full.
 *
 * Only for details that legitimately differ across the package versions the demoshops span; it
 * accepts either contract, so narrow it back to `expectApiValidationError` once they converge.
 */
export function expectApiValidationErrorAnyOf(response: ApiErrorResponse, acceptedDetailSets: string[][]): void {
  expectApiValidationResponse(response);

  const details = response.body.errors.map((error) => error.detail);
  const isMatched = acceptedDetailSets.some((acceptedDetails) =>
    acceptedDetails.every((detail) => details.includes(detail))
  );

  // Serialized into the message because Chai renders a list of long strings as `Array(n)`.
  expect(
    isMatched,
    `expected response error details ${JSON.stringify(details)} to contain every detail of one of ${JSON.stringify(
      acceptedDetailSets
    )}`
  ).to.be.true;
}
