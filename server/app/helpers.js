export function getUserIdFromRequest( req ) {
  return req.user.sub;
}

export function removeElementFromArray( ary, element ) {
  return ary.reduce( ( collection, el ) => {
    if ( el !== element ) collection.push( el );
    return collection;
  }, [] );
}
