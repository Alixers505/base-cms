const { asyncRoute, isFunction: isFn } = require('@base-cms/utils');
const { websiteSection: loader } = require('@base-cms/web-common/page-loaders');

module.exports = ({
  template,
  queryFragment,
  aliasResolver,
  redirectOnPathMismatch = true,
} = {}) => asyncRoute(async (req, res) => {
  const alias = isFn(aliasResolver) ? await aliasResolver(req, res) : req.params.alias;
  const { apollo } = req;

  const section = await loader(apollo, { alias, queryFragment });
  const { redirectTo, canonicalPath } = section;
  if (redirectTo) {
    return res.redirect(301, redirectTo);
  }
  if (redirectOnPathMismatch && canonicalPath !== req.path) {
    return res.redirect(301, canonicalPath);
  }
  return res.marko(template, { section });
});
