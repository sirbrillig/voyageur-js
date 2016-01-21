import React from 'react';
import { connect } from 'react-redux';

import { doAuth, parseAuthToken, getProfile } from '../lib/actions/auth';
import LoggedIn from './logged-in';
import LogInBox from './log-in-box';

const App = React.createClass( {
  componentWillMount() {
    if ( ! this.props.auth.token ) {
      this.props.dispatch( parseAuthToken() );
    }
  },

  componentDidMount() {
    this.getUserInfo();
  },

  componentDidUpdate() {
    this.getUserInfo();
  },

  getUserInfo() {
    if ( this.props.auth.token && ! this.props.auth.user ) {
      this.props.dispatch( getProfile() );
    }
  },

  showAuth() {
    this.props.dispatch( doAuth() )
  },

  render() {
    if ( this.props.auth.token ) {
      return ( <LoggedIn /> );
    }
    return ( <LogInBox showAuth={ this.showAuth } /> );
  }
} );

function mapStateToProps( state ) {
  const { auth } = state;
  return { auth };
}

export default connect( mapStateToProps )( App );
