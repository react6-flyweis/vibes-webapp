export function extractApiErrorMessage(error: unknown): string | undefined {
  // Common shapes:
  // - string
  // - { message: string }
  // - { error: string }
  // - axios-style: { response: { data: { message: string } } }
  // - fetch-style: { data: { message: string } }

  if (!error) return undefined;

  // If it's a string
  if (typeof error === "string" && error.trim().length > 0) return error;

  // If it's an Error instance
  if (error instanceof Error) {
    if (error.message) return error.message;
  }

  // If it's an object, try common paths
  try {
    const anyErr = error as any;

    // axios: error.response.data or error.response.data.message
    if (anyErr.response) {
      const resp = anyErr.response;
      if (resp.data) {
        if (typeof resp.data === "string") return resp.data;
        if (resp.data.message) return String(resp.data.message);
        // sometimes error is { data: { errors: [...] } }
        if (resp.data.errors) {
          if (Array.isArray(resp.data.errors) && resp.data.errors.length > 0) {
            const first = resp.data.errors[0];
            if (typeof first === "string") return first;
            if (first?.message) return String(first.message);
          }
        }
      }
      if (resp.message) return String(resp.message);
    }

    // fetch or custom API: error.data.message or error.data
    if (anyErr.data) {
      if (typeof anyErr.data === "string") return anyErr.data;
      if (anyErr.data.message) return String(anyErr.data.message);
    }

    // direct message or error fields
    if (anyErr.message) return String(anyErr.message);
    if (anyErr.error) return String(anyErr.error);

    // If payload is { errors: [{ message: '...' }, ...] }
    if (
      anyErr.errors &&
      Array.isArray(anyErr.errors) &&
      anyErr.errors.length > 0
    ) {
      const first = anyErr.errors[0];
      if (typeof first === "string") return first;
      if (first?.message) return String(first.message);
    }
  } catch (e) {
    // ignore parsing errors
  }

  return undefined;
}
