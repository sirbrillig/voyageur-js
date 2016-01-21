import React from 'react';

export default React.createClass( {
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
  },

  render() {
    return <div className="location-search"><input className="form-control" type="text" placeholder="Search" onChange={ event => this.props.onChange( event.target.value ) } /></div>;
  }
} );

