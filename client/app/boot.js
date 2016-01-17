import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './lib/store';
import auth from './auth0-variables';
import App from './app';

ReactDOM.render(
  <Provider store={ store } >
    <App clientId={ auth.AUTH0_CLIENT_ID } domain={ auth.AUTH0_DOMAIN } />
  </Provider>,
document.getElementById( 'container' ) );
