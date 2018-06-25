import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';


export const CombineReducers = (obj) =>
{
    const rootReducers = combineReducers(obj)
    return rootReducers
}

export const CreateAppStore = (rootReducers)=>{

    const store = createStore(
        rootReducers,
        compose(
            applyMiddleware(thunk)
        )
    );

    return store;

}
