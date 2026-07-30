/**
 * Glue API validation error code (`422 Unprocessable Entity`).
 */
export const API_VALIDATION_ERROR_CODE = '901';

type ApiErrorResponse = Cypress.Response<{ errors: Array<{ code?: string; detail: string }> }>;

/**
 * Asserts a `422` response carrying the shared validation error code.
 */
function expectApiValidationResponse(response: ApiErrorResponse): void {
  expect(response.status).to.eq(422);

  const codes = response.body.errors.map((error) => `${error.code}`);

  expect(codes, 'response error codes').to.include(API_VALIDATION_ERROR_CODE);
}

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
  expectApiValidationResponse(response);
  expectApiErrorDetail(response, detail);
}

/**
 * Asserts a `422` validation error whose details match one of the accepted sets in full.
 *
 * Use this only where the details for one and the same request legitimately differ between the
 * package versions the demoshops currently span, so that a single expectation cannot hold for all of
 * them. It accepts either contract, so it cannot detect a regression from one to the other — narrow
 * it back to `expectApiValidationError` as soon as every consumer is on the same version.
 */
export function expectApiValidationErrorAnyOf(response: ApiErrorResponse, acceptedDetailSets: string[][]): void {
  expectApiValidationResponse(response);

  const details = response.body.errors.map((error) => error.detail);
  const isMatched = acceptedDetailSets.some((acceptedDetails) =>
    acceptedDetails.every((detail) => details.includes(detail))
  );

  // Both sides are serialized into the assertion message: a bare boolean would report
  // `expected false to be true`, and Chai renders a list of long strings as `Array(n)`.
  expect(
    isMatched,
    `expected response error details ${JSON.stringify(details)} to contain every detail of one of ${JSON.stringify(
      acceptedDetailSets
    )}`
  ).to.be.true;
}
