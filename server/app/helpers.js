export function getUserIdFromRequest( req ) {
  return req.user.sub;
}
