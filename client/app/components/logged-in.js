import React from 'react';
import Library from './library';
import WideButton from './wide-button';
import AddLocationForm from './add-location-form';
import { connect } from 'react-redux';
import { addLocation, hideAddLocation, showAddLocation } from '../lib/actions/library';

const Header = () => <div className="header"><img className="header__logo" src="/assets/logo.png" /><h1 className="header__title">Voyageur</h1></div>;
const Trip = () => <div className="trip col-xs-6"><h2 className="trip__title">Trip</h2></div>;
const Footer = () => <div className="footer">Made by Payton</div>;

const LoggedIn = React.createClass( {
  propTypes: {
    library: React.PropTypes.array,
    trip: React.PropTypes.array,
    isShowingAddLocation: React.PropTypes.bool,
  },

  toggleAddLocationForm() {
    if ( this.props.isShowingAddLocation ) {
      return this.props.dispatch( hideAddLocation() );
    }
    this.props.dispatch( showAddLocation() );
  },

  onAddLocation( params ) {
    this.props.dispatch( addLocation( params ) );
  },

  renderAddLocationForm() {
    return <AddLocationForm onAddLocation={ this.onAddLocation }/>;
  },

  renderAddLocationButton() {
    const text = this.props.isShowingAddLocation ? 'Cancel adding location' : 'Add a new location';
    return <WideButton className="add-location-button" text={ text } onClick={ this.toggleAddLocationForm } />
  },

  render() {
    return (
      <div className="logged-in">
        <Header />
        <div className="row">
          <div className="col-xs-6">
            { this.renderAddLocationButton() }
            { this.props.isShowingAddLocation ? this.renderAddLocationForm() : '' }
            <Library locations={ this.props.library } />
          </div>
          <Trip triplocations={ this.props.trip }/>
        </div>
        <Footer />
      </div>
    );
  }
} );

function mapStateToProps( state ) {
  const { library, trip, ui } = state;
  return { library, trip, isShowingAddLocation: ui.isShowingAddLocation };
}

export default connect( mapStateToProps )( LoggedIn );
