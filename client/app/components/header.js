import React from 'react';
import noop from 'lodash.noop';

export default React.createClass( {
  propTypes: {
    errors: React.PropTypes.array,
    onClearNotices: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      errors: [],
      onClearNotices: noop,
    }
  },

  renderNotices() {
    return this.props.errors.map( this.renderError );
  },

  renderError( error, key ) {
    return <div key={ 'notices__error__' + error + key } className="alert alert-warning" role="alert">{ error }</div>;
  },

  renderClearNotices() {
    return <button className="notices__clear btn btn-block btn-default" onClick={ this.props.onClearNotices }>clear notices</button>;
  },

  render() {
    return (
      <div className="header">
        <img className="header__logo" src="/assets/logo.png" /><h1 className="header__title">Voyageur</h1>
        { this.props.errors.length > 0 ? this.renderClearNotices() : '' }
        { this.renderNotices() }
      </div>
    );
  }
} );
