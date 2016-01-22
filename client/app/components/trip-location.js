import React from 'react';

export default React.createClass( {
  propTypes: {
    tripLocation: React.PropTypes.object.isRequired,
    onRemoveTripLocation: React.PropTypes.func.isRequired,
  },

  renderControls() {
    if ( this.props.tripLocation.isLoading ) {
      return <span className="trip-location__loading glyphicon glyphicon-refresh glyphicon-spin" />;
    }
    return (
      <div className="btn-group btn-group-sm" role="group">
        <button className="btn btn-default" onClick={ () => this.props.onRemoveTripLocation( this.props.tripLocation._id ) }>Remove</button>
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
        <div className="col-xs-4" >
          <div className="trip-location__controls" >
          { this.renderControls() }
          </div>
        </div>
      </li>
    );
  }
} );

