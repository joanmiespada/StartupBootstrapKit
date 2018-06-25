import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import DevTools from '../../conf/DevTools';

export const CombineReducers = (obj) =>
{
    const rootReducers = combineReducers(obj)
    return rootReducers
}

export const CreateAppStore = (rootReducers)=>{

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        rootReducers,
        composeEnhancers(
            applyMiddleware(thunk,logger),
            DevTools.instrument()
        )
    );

   /* if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
          store.replaceReducer(rootReducer)
        })
      }*/

    return store;

}
