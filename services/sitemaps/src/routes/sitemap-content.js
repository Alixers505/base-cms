const { content: canonicalPathFor, requestParser: getCanonicalRules } = require('@base-cms/canonical-path');
const { asyncRoute } = require('@base-cms/utils');
const { BaseDB } = require('@base-cms/db');
const moment = require('moment');
const { PAGE_SIZE } = require('../env');

const { getContent, getPrimarySectionLoader } = require('../util');

const formatter = (docs = []) => `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${docs.reduce((str, { url, updated }) => `${str}  <url>
    <loc>${url}</loc>
    <lastmod>${moment(updated).format()}</lastmod>
    <priority>0.5</priority>
    <changefreq>weekly</changefreq>
  </url>\n`, '')}
</urlset>`;

module.exports = asyncRoute(async (req, res) => {
  const { baseUri, basedb } = res.locals;
  const canonicalRules = getCanonicalRules(req);

  try {
    const regex = /sitemap\/(?<type>[a-zA-Z]+)\.*(?<suffix>.*).xml$/;
    const { type, suffix } = req.path.match(regex).groups;
    const skip = suffix ? parseInt(suffix, 10) * PAGE_SIZE : 0;
    const docs = await getContent(basedb, type, skip);

    const sectionIds = [...new Set(docs.map((content) => {
      const ref = BaseDB.get(content, 'mutations.Website.primarySection');
      return BaseDB.extractRefId(ref);
    }))];

    // Inject a loader function into the context
    const load = await getPrimarySectionLoader(basedb, sectionIds);
    const context = { canonicalRules, load };

    const toFormat = await Promise.all(docs.map(async (content) => {
      const slug = BaseDB.get(content, 'mutations.Website.slug');
      const path = await canonicalPathFor({ slug, ...content }, context);
      const url = `${baseUri}${path}`;
      return { ...content, url };
    }));
    res.end(formatter(toFormat));
  } catch (e) {
    res.status(500).send();
  }
});
