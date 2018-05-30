import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from '../rootReducer';


export default function ConfigureStore(preloadedState) {
  const middleWare = [];

  middleWare.push(thunk);

  const loggerMiddleware = createLogger({
    predicate: () => process.env.NODE_ENV === 'development',
  });
  middleWare.push(loggerMiddleware);

  const store = createStore(
    reducers,
    preloadedState,
    compose(applyMiddleware(...middleWare)),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../rootReducer', () => {
      store.replaceReducer(reducers);
    });
  }

  return store;
}
