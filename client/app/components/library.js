import React from 'react';

export default React.createClass( {
  propTypes: {
    locations: React.PropTypes.array,
  },

  renderLocations() {
    return this.props.locations.map( this.renderLocation );
  },

  renderLocation( location ) {
    return <li key={ location._id } >{ location.name }</li>;
  },

  render() {
    return (
      <div className="library col-xs-6">
        <h2 className="library__title">Library</h2>
        <ul>{ this.renderLocations() }</ul>
      </div>
    );
  }
} );

