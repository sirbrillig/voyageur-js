import React from 'react';
import LibraryLocation from './library-location';

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

