import React from 'react';
import TripLocation from './trip-location';

export default React.createClass( {
  propTypes: {
    tripLocations: React.PropTypes.array,
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

