import React, {useEffect} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import DestinationCard from "../../components/DestinationCard";
import {getDestinationsAction} from "../../redux/actions/spotsActions";

/**
 * The screen where the user can see their saved destinations.
 */
const DestinationsScreen = props => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.user.localId);
  const destinations = useSelector(state => state.spots.destinations);

  // Get destinations on load
  useEffect(() => {
    async function getDestinations() {
      dispatch(getDestinationsAction(userId))
    }
    getDestinations().then();
  }, [destinations]);

  const destinationSelected = (spotName, spotId) => {
    props.navigation.navigate('Spot', {spotName, spotId})
  };

  return (
    <View>
      {/* Creating a FlatList here to display all of the destinations */}
      <FlatList
        data={destinations}
        renderItem={
          destination => (
            <DestinationCard
              name={destination.item.name}
              area={destination.item.area}
              country={destination.item.country}
              image={destination.item.image}
              information={destination.item.information}
              destinationSelect={() => {destinationSelected(destination.item.name, destination.item.id)}}
            />
          )
        }
      />
    </View>
  )
};

// Navigation
DestinationsScreen.navigationOptions = navigationInfo => {
  return {
    headerTitle: 'My Destinations',
    headerTitleStyle: { alignSelf: 'center' }
  }
};

export default DestinationsScreen;
