import React from 'react';

export default React.createClass( {
  propTypes: {
    locations: React.PropTypes.array,
  },

  getDefaultProps() {
    return {
      locations: [],
    };
  },

  renderNoLocations() {
    return <div className="alert alert-info">No locations added yet!</div>;
  },

  renderLocations() {
    if ( this.props.locations.length > 0 ) return <ul>{ this.props.locations.map( this.renderLocation ) }</ul>;
    return this.renderNoLocations();
  },

  renderLocation( location ) {
    return <li key={ location._id } >{ location.name }</li>;
  },

  render() {
    return (
      <div className="library">
        { this.renderLocations() }
      </div>
    );
  }
} );

