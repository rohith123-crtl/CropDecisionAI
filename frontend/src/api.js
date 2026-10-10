export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    credentials: 'same-origin',
    signal: options.signal || AbortSignal.timeout(20000),
    headers: { 'Content-Type': 'application/json', 'X-Crop-Client': 'web', ...options.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(typeof data?.detail === 'string' ? data.detail : 'Something went wrong. Please try again.');
    error.status = response.status;
    throw error;
  }
  return data;
}
