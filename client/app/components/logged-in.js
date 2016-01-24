import React from 'react';
import Library from './library';
import WideButton from './wide-button';
import Header from './header';
import Trip from './trip';
import AdminDashboard from './admin-dashboard';
import TripMap from './trip-map';
import AddLocationForm from './add-location-form';
import EditLocationForm from './edit-location-form';
import LocationSearch from './location-search';
import { connect } from 'react-redux';
import {
  saveLocation,
  deleteLocation,
  startEditLocation,
  hideEditLocation,
  selectPreviousLocation,
  selectNextLocation,
  searchLocationsFor,
  fetchLibrary,
  addLocation,
  hideAddLocation,
  showAddLocation
} from '../lib/actions/library';
import { clearTrip, addToTrip, removeTripLocation, fetchTrip } from '../lib/actions/trip';
import { clearNotices, showAdmin } from '../lib/actions/general';
import { logOut } from '../lib/actions/auth';

const Footer = () => <div className="footer">Made by Payton</div>;
const Distance = ( props ) => <div className="distance well well-sm">{ ( props.meters * 0.000621371192 ).toFixed( 1 ) } miles</div>;

const LoggedIn = React.createClass( {
  propTypes: {
    isShowingAdmin: React.PropTypes.bool,
    isLoading: React.PropTypes.bool,
    library: React.PropTypes.array,
    visibleLocations: React.PropTypes.array,
    trip: React.PropTypes.array,
    isShowingAddLocation: React.PropTypes.bool,
    editingLocation: React.PropTypes.object,
    searchString: React.PropTypes.string,
    notices: React.PropTypes.object,
    distance: React.PropTypes.number,
    selectedLocation: React.PropTypes.number,
  },

  componentWillMount() {
    this.props.dispatch( fetchLibrary() );
    this.props.dispatch( fetchTrip() );
  },

  componentDidMount() {
    this.listenForKeys();
  },

  listenForKeys() {
    if ( ! window ) return;
    window.document.body.addEventListener( 'keydown', ( evt ) => {
      switch ( evt.keyCode ) {
        case 40:
          // pressing up and down changes the selected location
          evt.preventDefault();
          return this.moveSelectDown();
        case 38:
          evt.preventDefault();
          return this.moveSelectUp();
        case 13:
          // pressing enter adds the selected location
          return this.addSelectedLocationToTrip();
      }
    } );
  },

  moveSelectDown() {
    this.props.dispatch( selectNextLocation( this.props.visibleLocations.length - 1 ) );
  },

  moveSelectUp() {
    this.props.dispatch( selectPreviousLocation() );
  },

  addSelectedLocationToTrip() {
    const location = this.props.visibleLocations[ this.props.selectedLocation ];
    this.props.dispatch( addToTrip( location ) );
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

  onEditLocation( location ) {
    this.props.dispatch( startEditLocation( location ) )
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

  onClearSearch() {
    this.props.dispatch( searchLocationsFor( '' ) );
  },

  onLogOut() {
    this.props.dispatch( logOut() );
  },

  onCancelEditLocation() {
    this.props.dispatch( hideEditLocation() );
  },

  onSaveLocation( location, params ) {
    this.props.dispatch( saveLocation( location, params ) );
  },

  onDeleteLocation( location ) {
    this.props.dispatch( deleteLocation( location ) );
  },

  onAdminClick() {
    this.props.dispatch( showAdmin() );
  },

  renderEditLocationForm() {
    if ( this.props.editingLocation ) {
      return (
        <EditLocationForm
          location={ this.props.editingLocation }
          onSaveLocation={ this.onSaveLocation }
          onCancelEditLocation={ this.onCancelEditLocation }
          onDeleteLocation={ this.onDeleteLocation }
        />
      );
    }
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

  renderLoading() {
    return (
      <div className="loading">
        <h2>Loading...</h2>
      </div>
    );
  },

  renderAdmin() {
    return <AdminDashboard />;
  },

  renderMain() {
    if ( this.props.isShowingAdmin ) return this.renderAdmin();
    return (
      <div className="row">
        <div className="col-xs-6">
          { this.renderAddLocationButton() }
          { this.renderAddLocationForm() }
          <LocationSearch onChange={ this.onSearch } onClearSearch={ this.onClearSearch } />
          <Library
          locations={ this.props.library }
          visibleLocations={ this.props.visibleLocations }
          onAddToTrip={ this.onAddToTrip }
          onEditLocation={ this.onEditLocation }
          selectedLocation={ this.props.selectedLocation }
          />
        </div>
        <div className="col-xs-6">
          <WideButton className="clear-trip-button" text="Clear trip" onClick={ this.onClearTrip } />
          { this.renderMap() }
          <Distance meters={ this.props.distance } />
          <Trip tripLocations={ this.props.trip } getLocationById={ this.getLocationById } onRemoveTripLocation={ this.onRemoveTripLocation } />
        </div>
        { this.renderEditLocationForm() }
      </div>
    );
  },

  render() {
    return (
      <div className="logged-in">
        <Header errors={ this.props.notices.errors } onClearNotices={ this.onClearNotices } onAdminClick={ this.onAdminClick } onLogOut={ this.onLogOut } isAdmin={ this.props.isAdmin } />
          { this.props.isLoading ? this.renderLoading() : this.renderMain() }
        <Footer />
      </div>
    );
  }
} );

function mapStateToProps( state ) {
  const { auth, library, trip, ui, notices, distance } = state;
  return {
    isAdmin: ( auth.user && auth.user.role === 'admin' ),
    isShowingAdmin: ui.isShowingAdmin,
    library: library.locations,
    visibleLocations: library.visibleLocations,
    isLoading: library.isLoading,
    trip,
    distance: distance.distance,
    isShowingAddLocation: ui.isShowingAddLocation,
    searchString: ui.searchString,
    selectedLocation: ui.selectedLocation,
    editingLocation: ui.editingLocation,
    notices,
  };
}

export default connect( mapStateToProps )( LoggedIn );
