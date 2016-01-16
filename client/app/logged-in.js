import React from 'react';

export default React.createClass( {
  propTypes: {
    lock: React.PropTypes.object.isRequired,
    idToken: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      profile: null
    }
  },

  componentWillMount() {
    this.props.lock.getProfile( this.props.idToken, ( err, profile ) => {
      if ( err ) {
        console.log( 'Error loading the Profile', err );
        if ( window ) window.location = '/';
        return;
      }
      this.setState( { profile: profile } );
    } );
  },

  render() {
    if ( this.state.profile ) {
      return (
        <div className="logged-in">
          <Header profile={ this.state.profile }/>
          <Library />
          <Trip />
          <Footer />
        </div>
      );
    }
    return (
      <div className="logged-in">
        <div className="logged-in__error">
          <img className="logged-in__error__logo" src="/assets/logo.png" />
          <p className="logged-in__error__message">Sorry, I couldn't log you in.</p>
          <a href="/" className="logged-in__error__button btn btn-primary btn-lg btn-block">Try again</a>
        </div>
      </div>
    );
  }
} );
