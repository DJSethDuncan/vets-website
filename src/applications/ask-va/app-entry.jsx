import 'platform/polyfills';
// import '@department-of-veterans-affairs/platform-polyfills';
import '@department-of-veterans-affairs/ask-va/sass/ask-va-too';
// import './sass/my-new-application.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

// const script = document.createElement('script');
// script.nonce = '**CSP_NONCE**';
// script.type = 'text/javascript';
// script.text =
//   'function recordLinkClick(data) {\n' +
//   '  console.log("in the script");\n' +
//   '  window.dataLayer && window.dataLayer.push(data);\n' +
//   '  return false;\n' +
//   '};';
// document.body.appendChild(script);

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});