import React from 'react';
import classNames from 'classnames';

export default React.createClass( {
  propTypes: {
    location: React.PropTypes.object.isRequired,
    onAddToTrip: React.PropTypes.func.isRequired,
    isSelected: React.PropTypes.bool,
  },

  renderControls() {
    if ( this.props.location.isLoading ) {
      return <span className="library-location__loading glyphicon glyphicon-refresh glyphicon-spin" />;
    }
    return (
      <div className="btn-group btn-group-sm" role="group">
        <button className="btn btn-default">Edit</button>
        <button className="btn btn-primary" onClick={ () => this.props.onAddToTrip( this.props.location ) }>Add</button>
      </div>
    );
  },

  render() {
    const locationClassNames = classNames( 'library-location row well well-sm', { 'library-location--selected': this.props.isSelected } );
    return (
      <li className={ locationClassNames } >
        <div className="library-location__description col-xs-8" >
          <h3 className="library-location__description__name">{ this.props.location.name }</h3>
          <p className="library-location__description__address">{ this.props.location.address }</p>
        </div>
        <div className="col-xs-4" >
          <div className="library-location__controls" >
            { this.renderControls() }
          </div>
        </div>
      </li>
    );
  }
} );
