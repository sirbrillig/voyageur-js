import React from 'react';
import request from 'superagent';

export default React.createClass( {
  propTypes: {
    lock: React.PropTypes.object.isRequired,
    idToken: React.PropTypes.string.isRequired
  },

  callApi() {
    request.get( 'http://localhost:3001/secured/ping' )
    .set( 'Authorization', `Bearer ${this.props.idToken}` )
    .end( ( err ) => {
      if ( err ) return alert( 'You need to download the server seed and start it to call this API' );
      alert( 'The request to the secured enpoint was successfull' );
    } );
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
        alert( 'Error loading the Profile' );
      }
      this.setState( { profile: profile } );
    } );
  },

  render() {
    if ( this.state.profile ) {
      return (
        <div className="logged-in-box auth0-box logged-in">
          <h1 id="logo"><img src="https://cdn.auth0.com/blog/auth0_logo_final_blue_RGB.png" /></h1>
          <img src={ this.state.profile.picture } />
          <h2>Welcome { this.state.profile.nickname }</h2>
          <button onClick={ this.callApi } className="btn btn-lg btn-primary">Call API</button>
        </div>
      );
    }
    return (
      <div className="logged-in-box auth0-box logged-in">
        <h1 id="logo"><img src="https://cdn.auth0.com/blog/auth0_logo_final_blue_RGB.png" /></h1>
      </div>
    );
  }
} );
