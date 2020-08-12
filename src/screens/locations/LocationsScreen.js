import React, {useEffect} from 'react';
import {StyleSheet, View, Text, Button, FlatList, Alert} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import BottomSheet from 'react-native-bottomsheet';

import LocationCard from "../../components/LocationCard";
import {deleteLocationAction, getLocationsAction} from "../../redux/actions/spotsActions";

/**
 * Screen for displaying a user's submitted locations.
 */
const LocationsScreen = props => {
  const dispatch = useDispatch();
  const locations = useSelector(state => state.spots.locations);
  const userId = useSelector(state => state.user.user.localId);

  // Get locations on page load
  useEffect( () => {
    async function getLocations() {
      dispatch(getLocationsAction(userId));
    }
    getLocations().then();
  }, []);

  // Show a bottom sheet when a location is clicked
  const showSheet = (spotName, spotId) => {
    BottomSheet.showBottomSheetWithOptions({
      options: ['View', 'Edit', 'Delete', 'Cancel'],
      title: 'Options',
      cancelButtonIndex: 3,
    }, (value) => {
      if (value === 0) {
        props.navigation.navigate('Spot', {spotName, spotId});
      } else if (value === 1) {
        props.navigation.navigate('Edit', {spotName, spotId});
      } else if (value === 2) {
        Alert.alert(
          'Deleting Spot',
          'Are you sure you want to delete this location?',
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                dispatch(deleteLocationAction(spotId));
              }
            },
          ],
          {cancelable: false},
        );
      }
    });
  };

  // Return a view that lists all of the user's submitted locations as a LocationCard
  return (
    <View style={styles.locationsView}>
      <FlatList
        data={locations}
        extraData={locations}
        keyExtractor={location => location.id}
        renderItem={
          location => (
            <LocationCard
              name={location.item.name}
              image={location.item.image}
              locationSelect={() => {showSheet(location.item.name, location.item.id)}}
            />
          )
        }
      />
    </View>
  )
};

// Styling
const styles = StyleSheet.create({
  headerIconLeft: {
    marginLeft: 15
  },
  headerIconRight: {
    marginRight: 15
  },
  locationsView: {
    marginHorizontal: 20
  }
});

// Navigation
LocationsScreen.navigationOptions = navigationInfo => {
  return {
    headerTitle: 'My Locations',
    headerTitleStyle: { alignSelf: 'center' },
    headerRight:
      (
        <Icon
          name='md-add'
          style={styles.headerIconRight}
          size={24}
          onPress={() => {
            navigationInfo.navigation.navigate('Add');
          }}/>
      )
  }
};

export default LocationsScreen;
