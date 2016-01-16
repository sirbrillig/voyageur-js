import React from 'react';
import ReactDOM from 'react-dom';

import auth from './auth0-variables';
import App from './app';

ReactDOM.render( <App clientId={ auth.AUTH0_CLIENT_ID } domain={ auth.AUTH0_DOMAIN } />, document.getElementById( 'container' ) );
