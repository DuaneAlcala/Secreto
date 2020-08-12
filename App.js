/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment } from 'react';
import { StyleSheet } from 'react-native';
import {
  Provider
} from 'react-redux'
import {
  applyMiddleware,
  combineReducers,
  createStore
} from 'redux';
import thunk from 'redux-thunk';
import * as firebase from 'firebase';

import AppNavigation from './src/navigation/AppNavigation';
import spotsReducer from './src/redux/reducers/spotsReducer';
import userReducer from "./src/redux/reducers/userReducer";
import opinionsReducer from "./src/redux/reducers/opinionsReducer";
import {secrets} from "./src/environments/secrets";

// Create the main reducer
const rootReducer = combineReducers({
  spots: spotsReducer,
  user: userReducer,
  opinions: opinionsReducer
});

// Create the store
const reduxStore = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(secrets.firebaseConfig);
  }

  return (
    <Provider store={reduxStore}>
      <AppNavigation />
    </Provider>
  )
};

const styles = StyleSheet.create({

});

export default App;
