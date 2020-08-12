import React, {useEffect} from 'react';
import { View } from 'react-native';
import {useDispatch} from "react-redux";
import {logoutAction} from "../../redux/actions/userActions";

/**
 * Screen for when the user logs out.
 */
const LogoutScreen = props => {
  const dispatch = useDispatch();

  // Log the user out on load page
  useEffect(() => {
    async function doLogout() {
      await dispatch(logoutAction());
      props.navigation.navigate('Login');
    }
    doLogout().then();
  }, []);

  return (
    <View>
    </View>
  )
};

// Navigation
LogoutScreen.navigationOptions = navigationInfo => {
  return {
    header: null
  }
};

export default LogoutScreen;
