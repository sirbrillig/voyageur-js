import React from 'react';
import { connect } from 'react-redux';
import { fetchEvents } from '../lib/actions/admin.js';
import classNames from 'classnames';

const AdminDashboard = React.createClass( {
  propTypes: {
    events: React.PropTypes.array.isRequired,
  },

  componentWillMount() {
    this.props.dispatch( fetchEvents() );
  },

  renderEvent( event ) {
    const classes = classNames( {
      info: ( event.event === 'get' ),
      success: ( event.event === 'create' ),
      warning: ( event.event === 'update' ),
      danger: ( event.event === 'delete' ),
    } );
    return (
      <tr key={ event._id } className={ classes }>
        <td>{ event.time }</td>
        <td>{ event.userId }</td>
        <td>{ event.name }</td>
        <td>{ event.event }</td>
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
  return { events: state.admin.events };
}

export default connect( mapStateToProps )( AdminDashboard );
