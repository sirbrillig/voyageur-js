import React from 'react';
import { connect } from 'react-redux';
import Auth0Lock from 'auth0-lock';

import LoggedIn from './logged-in';
import LogInBox from './log-in-box';

const App = React.createClass( {
  componentWillMount() {
    this.createLock();
    this.setState( { idToken: this.getIdToken() } );
  },

  getInitialState() {
    return {
      idToken: {}
    };
  },

  createLock() {
    this.lock = new Auth0Lock( this.props.clientId, this.props.domain );
  },

  getIdToken() {
    var idToken = localStorage.getItem( 'userToken' );
    var authHash = this.lock.parseHash( window.location.hash );
    if ( !idToken && authHash ) {
      if ( authHash.id_token ) {
        idToken = authHash.id_token
        localStorage.setItem( 'userToken', authHash.id_token );
      }
      if ( authHash.error ) {
        console.log( 'Error signing in', authHash );
      }
    }
    return idToken;
  },

  render() {
    if ( this.state.idToken ) {
      return ( <LoggedIn lock={ this.lock } idToken={ this.state.idToken } /> );
    }
    return ( <LogInBox lock={ this.lock } /> );
  }
} );

function mapStateToProps( state ) {
  const { auth, library, trip } = state;
  return { auth, library, trip };
}

export default connect( mapStateToProps )( App );
