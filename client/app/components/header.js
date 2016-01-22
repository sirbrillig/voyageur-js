import React from 'react';
import noop from 'lodash.noop';

export default React.createClass( {
  propTypes: {
    errors: React.PropTypes.array,
    onClearNotices: React.PropTypes.func,
    onLogOut: React.PropTypes.func,
    isAdmin: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      errors: [],
      onClearNotices: noop,
      onLogOut: noop,
      isAdmin: false,
    }
  },

  renderNotices() {
    return this.props.errors.map( this.renderError );
  },

  renderError( error, key ) {
    return <div key={ 'notices__error__' + error + key } className="notices__notice alert alert-warning" role="alert">{ error }</div>;
  },

  renderClearNotices() {
    return <button className="notices__clear btn btn-block btn-default" onClick={ this.props.onClearNotices }>clear notices</button>;
  },

  renderAdminButton() {
    if ( this.props.isAdmin ) return <button className="btn btn-default admin-button"><span className="glyphicon glyphicon-dashboard" aria-hidden="true"></span></button>;
  },

  render() {
    return (
      <div className="header">
        <h1 className="header__title">Voyageur</h1>
        <img className="header__logo" src="/assets/logo.png" />
        <div className="header__buttons">
          { this.renderAdminButton() }
          <button className="btn btn-default log-out-button" onClick={ this.props.onLogOut }>Log out</button>
        </div>
        <div className="notices">
          { this.props.errors.length > 0 ? this.renderClearNotices() : '' }
          { this.renderNotices() }
        </div>
      </div>
    );
  }
} );
