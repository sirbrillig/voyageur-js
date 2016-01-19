import React from 'react';
import Library from './library';
import WideButton from './wide-button';
import Header from './header';
import Trip from './trip';
import TripMap from './trip-map';
import AddLocationForm from './add-location-form';
import { connect } from 'react-redux';
import { fetchLibrary, addLocation, hideAddLocation, showAddLocation } from '../lib/actions/library';
import { addToTrip, removeTripLocation, fetchTrip } from '../lib/actions/trip';
import { clearNotices } from '../lib/actions/general';

const Footer = () => <div className="footer">Made by Payton</div>;

const LoggedIn = React.createClass( {
  propTypes: {
    library: React.PropTypes.array,
    trip: React.PropTypes.array,
    isShowingAddLocation: React.PropTypes.bool,
  },

  componentWillMount() {
    this.props.dispatch( fetchLibrary() );
    this.props.dispatch( fetchTrip() );
  },

  getLocationById( id ) {
    return this.props.library.reduce( ( found, location ) => {
      if ( location._id === id ) return location;
      return found;
    }, null );
  },

  toggleAddLocationForm() {
    if ( this.props.isShowingAddLocation ) {
      return this.props.dispatch( hideAddLocation() );
    }
    this.props.dispatch( showAddLocation() );
  },

  onAddLocation( params ) {
    this.props.dispatch( addLocation( params ) );
  },

  onAddToTrip( location ) {
    this.props.dispatch( addToTrip( location ) );
  },

  onRemoveTripLocation( tripLocation ) {
    this.props.dispatch( removeTripLocation( tripLocation ) );
  },

  onClearNotices() {
    this.props.dispatch( clearNotices() );
  },

  renderAddLocationForm() {
    return <AddLocationForm onAddLocation={ this.onAddLocation }/>;
  },

  renderAddLocationButton() {
    const text = this.props.isShowingAddLocation ? 'Cancel adding location' : 'Add a new location';
    return <WideButton className="add-location-button" text={ text } onClick={ this.toggleAddLocationForm } />
  },

  renderMap() {
    if ( this.props.trip.length < 2 ) return;
    return <TripMap tripLocations={ this.props.trip } getLocationById={ this.getLocationById } />;
  },

  render() {
    return (
      <div className="logged-in">
        <Header errors={ this.props.notices.errors } onClearNotices={ this.onClearNotices } />
        <div className="row">
          <div className="col-xs-6">
            { this.renderAddLocationButton() }
            { this.props.isShowingAddLocation ? this.renderAddLocationForm() : '' }
            <Library locations={ this.props.library } onAddToTrip={ this.onAddToTrip } />
          </div>
          <div className="col-xs-6">
            { this.renderMap() }
            <Trip tripLocations={ this.props.trip } getLocationById={ this.getLocationById } onRemoveTripLocation={ this.onRemoveTripLocation } />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
} );

function mapStateToProps( state ) {
  const { library, trip, ui, notices } = state;
  return { library, trip, isShowingAddLocation: ui.isShowingAddLocation, notices };
}

export default connect( mapStateToProps )( LoggedIn );
