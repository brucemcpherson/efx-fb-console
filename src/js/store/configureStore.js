import { createStore , applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import thunk from "redux-thunk";

//import logger from 'redux-logger';

// add logger() to get store logging back.,logger()
const middleWare = applyMiddleware(thunk);  

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    middleWare
    //window.devToolsExtension ? window.devToolsExtension() : undefined,
    
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
