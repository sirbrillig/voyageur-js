export function fetchLibrary() {
  return function( dispatch ) {
    const locations = [ { _id: 1, name: 'Home', address: '123 home place' } ];
    dispatch( gotLibrary( locations ) );
  }
}

export function gotLibrary( library ) {
  return { type: 'LIBRARY_GOT_LOCATIONS', library };
}
