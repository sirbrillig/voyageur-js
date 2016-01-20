import React from 'react';
import Library from './library';
import WideButton from './wide-button';
import Header from './header';
import Trip from './trip';
import TripMap from './trip-map';
import AddLocationForm from './add-location-form';
import { connect } from 'react-redux';
import { searchLocationsFor, fetchLibrary, addLocation, hideAddLocation, showAddLocation } from '../lib/actions/library';
import { clearTrip, addToTrip, removeTripLocation, fetchTrip } from '../lib/actions/trip';
import { clearNotices } from '../lib/actions/general';

const Footer = () => <div className="footer">Made by Payton</div>;
const Distance = ( props ) => <div className="distance well well-sm">{ ( props.meters * 0.000621371192 ).toFixed( 1 ) } miles</div>;
const LocationSearch = ( props ) => <div className="location-search"><input className="form-control" type="text" placeholder="Search" onChange={ event => props.onChange( event.target.value ) } /></div>;

const LoggedIn = React.createClass( {
  propTypes: {
    library: React.PropTypes.array,
    trip: React.PropTypes.array,
    isShowingAddLocation: React.PropTypes.bool,
    searchString: React.PropTypes.string,
    notices: React.PropTypes.array,
    distance: React.PropTypes.number,
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

  onClearTrip() {
    this.props.dispatch( clearTrip() );
  },

  onSearch( searchString ) {
    this.props.dispatch( searchLocationsFor( searchString ) );
  },

  renderAddLocationForm() {
    if ( ! this.props.isShowingAddLocation ) return;
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
            <LocationSearch onChange={ this.onSearch } />
            { this.renderAddLocationButton() }
            { this.renderAddLocationForm() }
            <Library locations={ this.props.library } onAddToTrip={ this.onAddToTrip } searchString={ this.props.searchString } />
          </div>
          <div className="col-xs-6">
            <WideButton className="clear-trip-button" text="Clear trip" onClick={ this.onClearTrip } />
            { this.renderMap() }
            <Distance meters={ this.props.distance } />
            <Trip tripLocations={ this.props.trip } getLocationById={ this.getLocationById } onRemoveTripLocation={ this.onRemoveTripLocation } />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
} );

function mapStateToProps( state ) {
  const { library, trip, ui, notices, distance } = state;
  return { library, trip, distance: distance.distance, isShowingAddLocation: ui.isShowingAddLocation, searchString: ui.searchString, notices };
}

export default connect( mapStateToProps )( LoggedIn );
