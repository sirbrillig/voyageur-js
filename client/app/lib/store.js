import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const createStoreWithMiddleware = compose(
  applyMiddleware( thunk )
)( createStore );

export default createStoreWithMiddleware( reducers );
