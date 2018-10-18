import createRoutes from 'next-routes';

var routes = createRoutes();
var Link = routes.Link,
    Router = routes.Router;

var redirect = function redirect(res, route) {
  var code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 301;

  if (res) {
    // Server-side only.
    res.writeHead(code, {
      Location: route
    });
    res.end();
  } else {
    // Client-side.
    Router.replaceRoute(route);
  }
}; // @todo Override the normal Link component to support external links.

export { routes, redirect, Link, Router };