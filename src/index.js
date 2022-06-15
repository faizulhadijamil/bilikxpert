import './index.css';

import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware
} from 'react-router-redux';
import {
  Provider
} from 'react-redux'
import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose
} from 'redux'
import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';

import {
  Route
} from 'react-router'
import createHistory from 'history/createBrowserHistory'

import * as Actions from './actions';
import App from './App';
import reducer from './reducer.js'
import registerServiceWorker from './registerServiceWorker';

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
// + const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
// - const store = createStore(reducer, /* preloadedState, */ compose(
//     applyMiddleware(...middleware)
//   ));

const store = createStore(
  combineReducers({
    state: reducer,
    router: routerReducer
  }),
  composeEnhancers(applyMiddleware(thunk, middleware))
)

store.dispatch(Actions.bootstrap());

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))

ReactDOM.render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <div>
        <Route path="/" component={App}/>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker();

// <Route path="/about" component={About}/>
// <Route path="/topics" component={Topics}/>
// ReactDOM.render(<App />, document.getElementById('root'));