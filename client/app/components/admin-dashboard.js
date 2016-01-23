import React from 'react';
import { connect } from 'react-redux';

const AdminDashboard = React.createClass( {
  render() {
    return <div><h1>Admin</h1></div>;
  }
} );

function mapStateToProps( state ) {
  return { admin: state.admin };
}

export default connect( mapStateToProps )( AdminDashboard );
