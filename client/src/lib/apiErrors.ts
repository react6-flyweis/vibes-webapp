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

  // If it's an object, try common paths
  try {
    const anyErr = error as any;

    // axios: error.response.data or error.response.data.message
    if (anyErr.response) {
      const resp = anyErr.response;
      if (resp.data) {
        const d = resp.data;
        // resp.data might be a stringified JSON, or an object like { success: false, message: '...' }
        if (typeof d === "string") {
          // try to parse JSON bodies (some servers return stringified JSON in error responses)
          try {
            const parsed = JSON.parse(d);
            if (parsed && typeof parsed === "object") {
              if (parsed.message) return String(parsed.message);
              if (parsed.msg) return String(parsed.msg);
              if (parsed.error) return String(parsed.error);
              if (
                parsed.success === false &&
                (parsed.message || parsed.msg || parsed.error)
              ) {
                return String(parsed.message || parsed.msg || parsed.error);
              }
            }
          } catch (e) {
            // not JSON, fall through and return the raw string below
          }
          return d;
        }

        // common string fields
        if (d?.message) return String(d.message);
        if (d?.msg) return String(d.msg);
        if (d?.error) return String(d.error);

        // sometimes APIs return { success: false, message: '...' }
        if (d?.success === false) {
          if (d?.message) return String(d.message);
          if (d?.msg) return String(d.msg);
          if (d?.error) return String(d.error);
        }

        // sometimes error is { data: { errors: [...] } }
        if (d?.errors) {
          if (Array.isArray(d.errors) && d.errors.length > 0) {
            const first = d.errors[0];
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

    // Top-level API shapes like { success: false, message: '...' }
    if (anyErr?.success === false) {
      if (anyErr?.message) return String(anyErr.message);
      if (anyErr?.msg) return String(anyErr.msg);
      if (anyErr?.error) return String(anyErr.error);
    }

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
