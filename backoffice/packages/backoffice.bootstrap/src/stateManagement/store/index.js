import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import logger from 'redux-logger';

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
            applyMiddleware(logger)
        )
    );

    return store;

}
