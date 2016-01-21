import React from 'react';

export default React.createClass( {
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    inputWasMounted: React.PropTypes.func.isRequired,
  },

  render() {
    return <div className="location-search"><input ref={ this.props.inputWasMounted } className="form-control" type="text" placeholder="Search" onChange={ event => this.props.onChange( event.target.value ) } /></div>;
  }
} );

