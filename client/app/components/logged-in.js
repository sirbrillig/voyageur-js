import React from 'react';
import Library from './library';
import AddLocationForm from './add-location-form';
import { connect } from 'react-redux';
import { showAddLocation } from '../lib/actions/library';

const Header = () => <div className="header"><img className="header__logo" src="/assets/logo.png" /><h1 className="header__title">Voyageur</h1></div>;
const Trip = () => <div className="trip col-xs-6"><h2 className="trip__title">Trip</h2></div>;
const Footer = () => <div className="footer">Made by Payton</div>;
const Button = ( props ) => <button className={ `btn btn-default btn-block ${props.className}` } onClick={ props.onClick }>{ props.text }</button>;

const LoggedIn = React.createClass( {
  propTypes: {
    library: React.PropTypes.array,
    trip: React.PropTypes.array,
    isShowingAddLocation: React.PropTypes.bool,
  },

  onShowAddLocation() {
    this.props.dispatch( showAddLocation() );
  },

  renderAddLocationForm() {
    return <AddLocationForm />;
  },

  render() {
    return (
      <div className="logged-in">
        <Header />
        <div className="row">
          <div className="col-xs-6">
            <Button className="add-location-button" text="Add a new location" onClick={ this.onShowAddLocation } />
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
