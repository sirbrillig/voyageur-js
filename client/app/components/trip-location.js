import React from 'react';

export default React.createClass( {
  propTypes: {
    tripLocation: React.PropTypes.object.isRequired,
  },

  renderControls() {
    if ( this.props.tripLocation.isLoading ) {
      return <span className="trip-location__loading glyphicon glyphicon-refresh glyphicon-spin" />;
    }
    return (
      <div className="btn-group btn-group-sm" role="group">
        <button className="btn btn-default">Remove</button>
      </div>
    );
  },

  render() {
    return (
      <li className="trip-location row well well-sm" >
        <div className="trip-location__description col-xs-8" >
          <h3 className="trip-location__description__name">{ this.props.tripLocation.location.name }</h3>
          <p className="trip-location__description__address">{ this.props.tripLocation.location.address }</p>
        </div>
        <div className="trip-location__controls col-xs-4" >
          { this.renderControls() }
        </div>
      </li>
    );
  }
} );

