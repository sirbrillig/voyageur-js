import React from 'react';
import { connect } from 'react-redux';
import { fetchEvents } from '../lib/actions/admin.js';
import classNames from 'classnames';

const AdminDashboard = React.createClass( {
  propTypes: {
    events: React.PropTypes.array.isRequired,
    isAdmin: React.PropTypes.bool,
  },

  componentWillMount() {
    this.props.dispatch( fetchEvents() );
  },

  renderEvent( event ) {
    const method = event.event.toLowerCase();
    const classes = classNames( {
      info: ( method === 'get' ),
      success: ( method === 'create' || method === 'post' ),
      warning: ( method === 'update' || method === 'put' ),
      danger: ( method === 'delete' ),
    } );
    const eventDate = new Date( event.time );
    return (
      <tr key={ event._id } className={ classes }>
        <td>{ eventDate.toString() }</td>
        <td>{ event.userId }</td>
        <td>{ event.userName }</td>
        <td>{ event.path || event.name }</td>
        <td>{ method }</td>
      </tr>
    );
  },

  renderEventLog() {
    return (
      <table className="table table-condensed">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Name</th>
            <th>Scope</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
          { this.props.events.map( this.renderEvent ) }
        </tbody>
      </table>
    );
  },

  render() {
    if ( ! this.props.isAdmin ) return <h1>Unauthorized</h1>;
    return (
      <div className="admin">
        <h1>Admin Dashboard</h1>
        <div className="admin-main">
          { this.renderEventLog() }
        </div>
      </div>
    );
  }
} );

function mapStateToProps( state ) {
  return { isAdmin: ( state.auth.user && state.auth.user.role === 'admin' ), events: state.admin.events };
}

export default connect( mapStateToProps )( AdminDashboard );
