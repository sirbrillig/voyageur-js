import React from 'react';

const Header = () => <div className="header"><img className="header__logo" src="/assets/logo.png" /><h1 className="header__title">Voyageur</h1></div>;
const Library = () => <div className="library col-xs-6"><h2 className="library__title">Library</h2></div>;
const Trip = () => <div className="trip col-xs-6"><h2 className="trip__title">Trip</h2></div>;
const Footer = () => <div className="footer">Made by Payton</div>;

export default React.createClass( {
  render() {
    if ( this.props.profile ) {
      return (
        <div className="logged-in">
          <Header />
          <div className="row">
            <Library />
            <Trip />
            <Footer />
          </div>
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
