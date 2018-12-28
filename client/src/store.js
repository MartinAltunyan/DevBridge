import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index"

const middleware = [thunk];

const initalState = {}

const composeEnhancers = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose;
const store = createStore(rootReducer, initalState, composeEnhancers(applyMiddleware(...middleware)));

export default store;