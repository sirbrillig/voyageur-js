import React from 'react';

const LibraryLocation = ( props ) => {
  return (
    <li className="library-location" >
      <h3 className="library-location__name">{ props.location.name }</h3>
      <p className="library-location__address">{ props.location.address }</p>
      <span className="library-location__controls">{ props.location.isLoading ? <span className="glyphicon glyphicon-refresh" /> : '' }</span>
    </li>
  );
}

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

  renderMoreLocations() {
    return <div className="alert alert-info">Add another location to start getting distances!</div>;
  },

  renderHelpBox() {
    if ( this.props.locations.length === 0 ) {
      return this.renderNoLocations();
    }
    if ( this.props.locations.length === 1 ) {
      return this.renderMoreLocations();
    }
  },

  renderLocations() {
    if ( this.props.locations.length > 0 ) return <ul>{ this.props.locations.map( this.renderLocation ) }</ul>;
  },

  renderLocation( location ) {
    return <LibraryLocation key={ location._id } location={ location } />;
  },

  render() {
    return (
      <div className="library">
        { this.renderLocations() }
        { this.renderHelpBox() }
      </div>
    );
  }
} );

