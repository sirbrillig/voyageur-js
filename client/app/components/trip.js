import React from 'react';
import TripLocation from './trip-location';

export default React.createClass( {
  propTypes: {
    tripLocations: React.PropTypes.array,
    getLocationById: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      tripLocations: [],
    };
  },

  renderTripLocations() {
    if ( this.props.tripLocations.length > 0 ) return <ul>{ this.props.tripLocations.map( this.renderTripLocation ) }</ul>;
  },

  renderTripLocation( tripLocation ) {
    if ( ! tripLocation.location.name ) {
      const location = this.props.getLocationById( tripLocation.location );
      if ( ! location ) return; // Don't render tripLocations without a corresponding location
      tripLocation.location = location;
    }
    return <TripLocation key={ tripLocation._id } tripLocation={ tripLocation } />;
  },

  render() {
    return (
      <div className="trip">
        { this.renderTripLocations() }
      </div>
    );
  }
} );

