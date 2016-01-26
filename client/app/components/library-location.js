import React from 'react';
import classNames from 'classnames';
import { DragSource } from 'react-dnd';

const LibraryLocation = React.createClass( {
  propTypes: {
    location: React.PropTypes.object.isRequired,
    onAddToTrip: React.PropTypes.func.isRequired,
    onEditLocation: React.PropTypes.func.isRequired,
    isSelected: React.PropTypes.bool,
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired,
  },

  renderControls() {
    if ( this.props.location.isLoading ) {
      return <span className="library-location__loading glyphicon glyphicon-refresh glyphicon-spin" />;
    }
    return (
      <div className="btn-group btn-group-sm" role="group">
        <button className="btn btn-default" onClick={ () => this.props.onEditLocation( this.props.location ) }>Edit</button>
        <button className="btn btn-primary" onClick={ () => this.props.onAddToTrip( this.props.location ) }>Add</button>
      </div>
    );
  },

  render() {
    const locationClassNames = classNames( 'library-location row well well-sm', { 'library-location--selected': this.props.isSelected } );
    return this.props.connectDragSource(
      <li className={ locationClassNames } >
        <div className="library-location__description col-xs-8" >
          <h3 className="library-location__description__name">{ this.props.location.name }</h3>
          <p className="library-location__description__address">{ this.props.location.address }</p>
        </div>
        <div className="col-xs-4" >
          <div className="library-location__controls" >
            { this.renderControls() }
          </div>
        </div>
      </li>
    );
  }
} );

const componentToItem = {
  beginDrag( props ) {
    return { location: props.location._id };
  }
};

function collect( connect, monitor ) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

export default DragSource( 'LOCATION', componentToItem, collect )( LibraryLocation );
