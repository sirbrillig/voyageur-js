import React from 'react';
import LibraryLocation from './library-location';

export default React.createClass( {
  propTypes: {
    locations: React.PropTypes.array,
    onAddToTrip: React.PropTypes.func.isRequired,
    searchString: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      locations: [],
      searchString: '',
    };
  },

  matchesSearch( location ) {
    if ( this.props.searchString.length < 2 ) return true;
    return ( ~ location.name.toLowerCase().indexOf( this.props.searchString ) || ~ location.address.toLowerCase().indexOf( this.props.searchString ) );
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
    if ( this.props.locations.length < 1 ) return;
    const visibleLocations = this.props.locations.filter( l => this.matchesSearch( l ) );
    if ( visibleLocations.length > 0 ) return <ul>{ visibleLocations.map( this.renderLocation ) }</ul>;
    return <div className="alert alert-info">No matches for that search.</div>;
  },

  renderLocation( location ) {
    return <LibraryLocation key={ location._id } location={ location } onAddToTrip={ this.props.onAddToTrip } />;
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

