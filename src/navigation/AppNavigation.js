import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator, createBottomTabNavigator, NavigationActions } from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons'
import { Alert } from 'react-native';

import LandingScreen from "../screens/landing/LandingScreen";
import LoginScreen from "../screens/landing/LoginScreen";
import RegisterScreen from "../screens/landing/RegisterScreen";
import BrowseScreen from "../screens/browse/BrowseScreen";
import SpotScreen from "../screens/spots/SpotScreen";
import LocationsScreen from "../screens/locations/LocationsScreen";
import AddScreen from "../screens/locations/AddScreen";
import DestinationsScreen from "../screens/destinations/DestinationsScreen";
import EditScreen from "../screens/locations/EditScreen";
import SearchScreen from "../screens/search/SearchScreen";
import ResultsScreen from "../screens/search/ResultsScreen";
import LogoutScreen from "../screens/landing/LogoutScreen";
import EmptyScreen from "../screens/landing/EmptyScreen";

// Navigation stack for the pages outside of the main application
const LandingNavigation = createStackNavigator(
  {
    Landing: LandingScreen,
    Login: LoginScreen,
    Register: RegisterScreen,
    EmptyScreen: EmptyScreen,
    DoLogout: LogoutScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

// Navigation stack for when the user is browsing
const BrowseNavigation = createStackNavigator(
  {
    Browse: BrowseScreen,
    Spot: SpotScreen
  }, {
    headerLayoutPreset: 'center'
  }
);

// Navigation options for the Browse stack
BrowseNavigation.navigationOptions = ({ navigation }) => {
  // Hide tabs when viewing a spot's page
  const tabBarVisible = !(navigation.state.routes[navigation.state.index].routeName === 'Spot');
  return {
    tabBarVisible
  };
};

// Navigation stack for the "Locations" feature of the application. Linked to viewing, adding, and editing
// a location.
const LocationNavigation = createStackNavigator(
  {
    Locations: LocationsScreen,
    Spot: SpotScreen,
    Add: AddScreen,
    Edit: EditScreen
  }, {
    headerLayoutPreset: 'center'
  }
);

// Navigation options for the Location stack
LocationNavigation.navigationOptions = ({ navigation }) => {
  const route = navigation.state.routes[navigation.state.index].routeName;
  let tabBarVisible = true;

  // Hide tabs when viewing a spot's page
  if (route === 'Spot' || route === 'Add' || route === 'Edit') {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

// Navigation stack for the "Destinations" feature of the application.
const DestinationNavigation = createStackNavigator(
  {
    Destinations: DestinationsScreen,
    Spot: SpotScreen
  }, {
    headerLayoutPreset: 'center'
  }
);

// Navigation options for the Destinations stack
DestinationNavigation.navigationOptions = ({ navigation }) => {
  // Hide tabs when viewing a spot's page
  const tabBarVisible = !(navigation.state.routes[navigation.state.index].routeName === 'Spot');
  return {
    tabBarVisible
  };
};

// Navigation stack for the "Search" feature of the application.
const SearchNavigation = createStackNavigator(
  {
    Search: SearchScreen,
    Results: ResultsScreen,
    Spot: SpotScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

// Navigation options for the Search stack
SearchNavigation.navigationOptions = ({ navigation }) => {
  // Hide tabs when viewing a spot's page
  const tabBarVisible = !(navigation.state.routes[navigation.state.index].routeName === 'Spot');
  return {
    tabBarVisible
  };
};

// Navigation that contains the tabs and connects the previous navigation stacks.
const TabNavigation = createBottomTabNavigator(
  {
    Browse: {
      screen: BrowseNavigation,
      navigationOptions: {
        tabBarIcon: () => {
          return <Icon name='ios-compass' size={24} />
        }
      }
    },
    Locations: {
      screen: LocationNavigation,
      navigationOptions: {
        tabBarIcon: () => {
          return <Icon name='ios-map' size={24} />
        }
      }
    },
    Destinations: {
      screen: DestinationNavigation,
      navigationOptions: {
        tabBarIcon: () => {
          return <Icon name='ios-heart-empty' size={24} />
        }
      }
    },
    Search: {
      screen: SearchNavigation,
      navigationOptions: {
        tabBarIcon: () => {
          return <Icon name='ios-search' size={24} />
        }
      }
    },
    Logout: {
      screen: EmptyScreen,
      navigationOptions: ({navigation}) => ({
        tabBarIcon: () => {
          return <Icon name='ios-log-out' size={24} />
        },
        tabBarOnPress: () => {
          return Alert.alert('Logout Confirmation',
            'Do you want to log out?',[
              {
                text: 'Yes',
                onPress: () => {
                  navigation.dispatch(NavigationActions.navigate({ routeName: 'DoLogout' }))
                }
              },
              {
                text: 'Cancel'
              }
            ]
          );
        },
      })
    }
  }
);

// Switch navigation between the main application and the landing area
const SwitchNavigation = createSwitchNavigator({
  Landing: LandingNavigation,
  Application: TabNavigation
});

export default createAppContainer(SwitchNavigation)


