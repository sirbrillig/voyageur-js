import React from 'react';
import WideButton from './wide-button';

export default React.createClass( {
  render() {
    return (
      <div className="add-location-form form-horizontal">
        <div className="form-group">
          <label htmlFor="inputAddLocationName" className="col-sm-2 control-label">Name</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inputAddLocationName" placeholder="Location" />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="inputAddLocationAddress" className="col-sm-2 control-label">Address</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inputAddLocationAddress" placeholder="Address" />
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-12">
            <WideButton text="Add" />
          </div>
        </div>
      </div>
    );
  }
} );

