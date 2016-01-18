import React from 'react';
import { connect } from 'react-redux';

import { doAuth, parseAuthToken } from '../lib/actions/auth';
import { fetchLibrary } from '../lib/actions/library';
import LoggedIn from './logged-in';
import LogInBox from './log-in-box';

const App = React.createClass( {
  componentWillMount() {
    if ( this.props.auth.token ) {
      return this.props.dispatch( fetchLibrary() );
    }
    this.props.dispatch( parseAuthToken() );
  },

  componentDidUpdate() {
    return this.props.dispatch( fetchLibrary() );
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
