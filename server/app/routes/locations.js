import { Promise } from 'es6-promise';
import Location from '../models/location';
import LocationCollection from '../models/location-collection';
import { getUserIdFromRequest, removeElementFromArray } from '../helpers';

function removeLocationForUser( locationId, userId ) {
  return new Promise( ( resolve, reject ) => {
    findOrCreateCollectionForUser( userId )
    .then( ( collection ) => {
      collection.locations = removeElementFromArray( collection.locations, locationId );
      return removeLocation( locationId, userId )
      .then( ( location ) => {
        collection.save( ( saveErr ) => {
          if ( saveErr ) return reject( saveErr );
          resolve( location );
        } );
      } )
      .catch( reject );
    } )
  } );
}

function saveNewLocation( location, collection ) {
  return new Promise( ( resolve, reject ) => {
    location.save( ( err ) => {
      if ( err ) return reject( err );
      collection.locations.push( location._id );
      collection.save( ( collectionErr ) => {
        if ( collectionErr ) return reject( collectionErr );
        resolve( location );
      } );
    } );
  } );
}

function removeLocation( locationId, userId ) {
  return new Promise( ( resolve, reject ) => {
    Location.remove( { _id: locationId, userId }, ( removeErr, location ) => {
      if ( removeErr ) return reject( removeErr );
      resolve( location );
    } );
  } );
}

function reorderLocations( collection, locationIds ) {
  // for each locationId, find the matching Id in collection.locations, and if
  // found, append to the new array. If the new array does not contain an
  // element in the old array, return the old array to prevent orphans.
  let orphanFound = false;
  const newIds = locationIds.reduce( ( ordered, locationId ) => {
    if ( ~ collection.locations.indexOf( locationId ) && ! ~ ordered.indexOf( locationId ) ) {
      ordered.push( locationId );
    } else {
      orphanFound = true;
    }
    return ordered;
  }, [] );
  if ( orphanFound || newIds.length !== collection.locations.length ) return collection.locations;
  return newIds;
}

function updateLocationsInCollection( collection, locationIds ) {
  return new Promise( ( resolve, reject ) => {
    collection.locations = reorderLocations( collection, locationIds );
    collection.save( ( err ) => {
      if ( err ) return reject( err );
      resolve( collection );
    } );
  } );
}

function getLocationsForCollection( collection ) {
  return new Promise( ( resolve, reject ) => {
    collection.populate( 'locations', ( locationsErr, populatedCollection ) => {
      if ( locationsErr ) return reject( locationsErr );
      resolve( populatedCollection.locations );
    } );
  } );
}

function listLocationsForUser( userId ) {
  return new Promise( ( resolve, reject ) => {
    findOrCreateCollectionForUser( userId )
    .then( getLocationsForCollection )
    .then( resolve )
    .catch( reject );
  } );
}

function updateLocationListForUser( userId, locationIds ) {
  return new Promise( ( resolve, reject ) => {
    findOrCreateCollectionForUser( userId )
    .then( ( collection ) => updateLocationsInCollection( collection, locationIds ) )
    .then( getLocationsForCollection )
    .then( resolve )
    .catch( reject );
  } );
}

function findOrCreateCollectionForUser( userId ) {
  return new Promise( ( resolve, reject ) => {
    LocationCollection.findOrCreate( { userId }, ( err, collection ) => {
      if ( err ) return reject( err );
      resolve( collection );
    } );
  } );
}

function createNewLocationForUser( userId, params ) {
  const { name, address } = params;
  return new Promise( ( resolve, reject ) => {
    findOrCreateCollectionForUser( userId )
    .then( ( collection ) => {
      const location = new Location( { userId, name, address } );
      return saveNewLocation( location, collection );
    } )
    .then( resolve )
    .catch( reject );
  } );
}

export default {
  list( req, res ) {
    const userId = getUserIdFromRequest( req );
    listLocationsForUser( userId )
    .then( ( locations ) => {
      res.status( 200 ).json( locations );
    } )
    .catch( ( err ) => {
      res.status( 502 ).send( err );
    } );
  },

  create( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { name, address } = req.body;
    createNewLocationForUser( userId, { name, address } )
    .then( ( location ) => {
      res.status( 200 ).json( location );
    } )
    .catch( ( err ) => {
      res.status( 502 ).send( err );
    } );
  },

  get( req, res ) {
    const userId = getUserIdFromRequest( req );
    Location.findOne( { _id: req.params.location_id, userId } )
    .then( ( location ) => {
      res.status( 200 ).json( location );
    } )
    .then( null, ( err ) => {
      res.status( 502 ).send( err );
    } );
  },

  updateList( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { locations } = req.body;
    updateLocationListForUser( userId, locations )
    .then( ( updatedLocations ) => {
      res.status( 200 ).json( updatedLocations );
    } )
    .then( null, ( err ) => {
      res.status( 502 ).send( err );
    } );
  },

  update( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { name, address } = req.body;
    Location.findOne( { _id: req.params.location_id, userId } )
    .then( ( location ) => {
      location.name = name;
      location.address = address;
      location.save( ( saveErr ) => {
        if ( saveErr ) return res.status( 502 ).send( saveErr );
        res.status( 200 ).json( location );
      } );
    } )
    .then( null, ( err ) => {
      res.status( 502 ).send( err );
    } );
  },

  delete( req, res ) {
    const userId = getUserIdFromRequest( req );
    const locationId = req.params.location_id;
    removeLocationForUser( locationId, userId )
    .then( ( location ) => {
      res.status( 200 ).json( location );
    } )
    .catch( ( err ) => {
      res.status( 502 ).json( err );
    } )
  }
};
