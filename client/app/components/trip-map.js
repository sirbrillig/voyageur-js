import React from 'react';
import { GoogleMapLoader, GoogleMap, DirectionsRenderer } from 'react-google-maps';

const gmaps = window.google.maps;

export default React.createClass( {
  propTypes: {
    tripLocations: React.PropTypes.array.isRequired,
    getLocationById: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      origin: new gmaps.LatLng( 41.8507300, -87.6512600 ),
      destination: new gmaps.LatLng( 41.8525800, -87.6514100 ),
      directions: null,
    }
  },

  componentDidMount() {
    this.calculateRoute();
  },

  componentWillReceiveProps() {
    this.calculateRoute();
  },

  getAddresses() {
    return this.props.tripLocations.reduce( ( addrs, tripLocation ) => {
      if ( tripLocation.location.address ) return addrs.concat( tripLocation.location.address );
      const location = this.props.getLocationById( tripLocation.location );
      if ( ! location ) return addrs;
      return addrs.concat( location.address );
    }, [] );
  },

  calculateRoute() {
    let addresses = this.getAddresses();
    if ( addresses.length < 2 ) return console.error( 'Not enough addresses' );
    const origin = addresses.shift();
    const destination = addresses.pop();
    const waypoints = addresses.map( location => ( { location, stopover: true } ) );
    if ( waypoints.length > 8 ) return console.error( 'Too many waypoints' );
    const request = { origin, destination, waypoints, travelMode: gmaps.TravelMode.DRIVING };
    this.requestDirections( request );
  },

  requestDirections( request ) {
    const directionsService = new gmaps.DirectionsService();
    directionsService.route( request, this.updateDirectionsOnMap );
  },

  updateDirectionsOnMap( result, status ) {
    if ( status === gmaps.DirectionsStatus.OK ) {
      this.setState( { directions: result } );
    } else {
      console.error( 'error loading directions', result );
    }
  },

  handleMapClick() {
    const mapUrl = 'https://www.google.com/maps/dir/' + this.getAddresses().reduce( ( previous, address ) => {
      return previous + encodeURIComponent( address ) + '/';
    }, '' );
    window.location = mapUrl;
  },

  renderDirections() {
    if ( ! this.state.directions ) return;
    return <DirectionsRenderer directions={ this.state.directions } />;
  },

  renderGoogleMap() {
    return (
    <GoogleMap
      ref={ map => this.googleMap = map }
      defaultZoom={ 11 }
      defaultCenter={ this.state.origin }
      overviewMapControl={ false }
      scaleControl={ false }
      streetViewControl={ false }
      zoomControl={ false }
      mapTypeControl={ false }
      onClick={ this.handleMapClick }
    >
    { this.renderDirections() }
    </GoogleMap>
    );
  },

  render() {
    return (
      <GoogleMapLoader
        containerElement={ <div className="trip-map"/> }
        googleMapElement={ this.renderGoogleMap() }
      />
    );
  }
} );
