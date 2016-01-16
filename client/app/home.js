import React from 'react';

export default React.createClass( {
  showLock: function() {
    this.props.lock.show();
  },

  render: function() {
    return (
      <div className="login-box auth0-box before">
        <img className="login-box__logo" src="/assets/logo.png" />
        <h1 className="login-box__title">Voyageur</h1>
        <p className="login-box__subtitle">How far do you go?</p>
        <a onClick={ this.showLock } className="login-box__button btn btn-primary btn-lg btn-block">Let's Go!</a>
      </div>
    );
  }
} );
