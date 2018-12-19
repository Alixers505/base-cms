import { a as _typeof } from './chunk-3be546a6.js';

var componentDisplayName = (function (Comp) {
  if (typeof Comp === 'string') return Comp;
  return Comp.displayName || Comp.name || 'Unknown';
});

var isFunction = (function (v) {
  return typeof v === 'function';
});

var isObject = (function (v) {
  return v && _typeof(v) === 'object';
});

export { componentDisplayName, isFunction, isObject };