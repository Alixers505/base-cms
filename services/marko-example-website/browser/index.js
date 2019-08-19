import Browser from '@base-cms/marko-web/browser';
import GTM from '@base-cms/marko-web-gtm/browser';
import GAM from '@base-cms/marko-web-gam/browser';

GTM(Browser);
GAM(Browser);

// Register custom Vue components here...
/*
import SomeComponent from './some-component.vue';

Browser.registerComponent('SomeComponentName', SomeComponent);

This component would now be loadable within server-side templates via.
<marko-web-browser-component name="SomeComponentName" props={ someProp: 'someValue' } />

If you need to access Vue or jQuery within a browser component you may
do so by importing them from the core web library:

import Vue from '@base-cms/marko-web/browser/vue';
import $ from '@base-cms/marko-web/browser/jquery';

*/

export default Browser;
