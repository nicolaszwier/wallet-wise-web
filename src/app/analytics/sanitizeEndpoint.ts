export function sanitizeEndpoint(url: string | undefined): string {
  if (!url) return 'unknown';

  let path = url;
  try {
    if (url.startsWith('http')) {
      path = new URL(url).pathname;
    }
  } catch {
    // use raw string
  }

  const apiIndex = path.indexOf('/api');
  if (apiIndex >= 0) {
    path = path.slice(apiIndex + 4);
  }

  return path
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, ':id')
    .replace(/\/\d+(?=\/|$)/g, '/:id')
    .replace(/^([^/])/, '/$1');
}

export function errorTypeFromStatus(status: number | undefined): string {
  switch (status) {
    case 400:
      return 'bad_request';
    case 401:
      return 'unauthorized';
    case 404:
      return 'not_found';
    case 409:
      return 'conflict';
    case 500:
      return 'internal_server_error';
    default:
      return status ? `http_${status}` : 'unknown';
  }
}
