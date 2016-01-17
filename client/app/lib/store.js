import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage';
import reducers from './reducers';

const createStoreWithMiddleware = compose(
  applyMiddleware( thunk ),
  persistState( 'auth', { key: 'voyageur' } )
)( createStore );

export default createStoreWithMiddleware( reducers );
