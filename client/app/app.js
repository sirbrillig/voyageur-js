import React from 'react';
import { connect } from 'react-redux';

import { doAuth, parseAuthToken } from './lib/actions/auth';
import LoggedIn from './logged-in';
import LogInBox from './log-in-box';

const App = React.createClass( {
  componentWillMount() {
    this.props.dispatch( parseAuthToken() );
  },

  showAuth() {
    this.props.dispatch( doAuth() )
  },

  render() {
    if ( this.props.auth.token ) {
      return ( <LoggedIn profile={ true }/> );
    }
    return ( <LogInBox showAuth={ this.showAuth } /> );
  }
} );

function mapStateToProps( state ) {
  const { auth, library, trip } = state;
  return { auth, library, trip };
}

export default connect( mapStateToProps )( App );
