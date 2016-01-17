import React from 'react';
import Library from './library';

const Header = () => <div className="header"><img className="header__logo" src="/assets/logo.png" /><h1 className="header__title">Voyageur</h1></div>;
const Trip = () => <div className="trip col-xs-6"><h2 className="trip__title">Trip</h2></div>;
const Footer = () => <div className="footer">Made by Payton</div>;

export default React.createClass( {
  propTypes: {
    ready: React.PropTypes.bool,
    library: React.PropTypes.array,
    trip: React.PropTypes.array,
  },

  render() {
    if ( this.props.ready ) {
      return (
        <div className="logged-in">
          <Header />
          <div className="row">
            <Library locations={ this.props.library }/>
            <Trip triplocations={ this.props.trip }/>
          </div>
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
