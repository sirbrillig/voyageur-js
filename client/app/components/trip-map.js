import React from 'react';
import { GoogleMapLoader, GoogleMap } from 'react-google-maps';

export default React.createClass( {
  renderGoogleMap() {
    return (
    <GoogleMap
      defaultZoom={ 3 }
      defaultCenter={ { lat: -25, lng: 131 } }
      overviewMapControl={ false }
      scaleControl={ false }
      streetViewControl={ false }
      zoomControl={ false }
      mapTypeControl={ false }
    /> );
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
