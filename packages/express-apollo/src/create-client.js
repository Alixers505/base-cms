const fetch = require('node-fetch');
const { ApolloClient } = require('apollo-client');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { createHttpLink } = require('apollo-link-http');
const fragmentMatcher = require('./fragment-matcher');

const rootConfig = {
  connectToDevTools: false,
  ssrMode: true,
};

module.exports = (uri, config, linkConfig) => new ApolloClient({
  ...config,
  ...rootConfig,
  link: createHttpLink({ ...linkConfig, uri, fetch }),
  cache: new InMemoryCache({ fragmentMatcher }),
});
