function handler(event) {
  const request = event.request;
  const appRoute = /^\/(?:admin|auth\/callback|exam\/[^/]+)\/?$/;

  if (request.uri === '/' || appRoute.test(request.uri)) {
    request.uri = '/index.html';
  }

  return request;
}
