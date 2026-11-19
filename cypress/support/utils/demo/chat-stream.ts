const STREAM_DONE_SENTINEL = '[DONE]';

export function buildChatStreamBody(
  events: Array<Record<string, unknown>>,
  options: { isTerminated?: boolean } = {}
): string {
  const lines = events.map((event) => JSON.stringify(event));

  return [...lines, ...(options.isTerminated === false ? [] : [STREAM_DONE_SENTINEL])]
    .map((line) => `data: ${line}\n\n`)
    .join('');
}

export function readChatRequestBody(body: unknown): Record<string, unknown> {
  return typeof body === 'string' ? JSON.parse(body) : (body as Record<string, unknown>);
}

export function readChatStreamEvents(body: unknown): Array<Record<string, unknown>> {
  return String(body ?? '')
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice('data:'.length).trim())
    .filter((payload) => payload !== '' && payload !== STREAM_DONE_SENTINEL)
    .flatMap((payload) => {
      try {
        return [JSON.parse(payload) as Record<string, unknown>];
      } catch {
        return [];
      }
    });
}
