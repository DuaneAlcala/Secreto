import React, {useEffect} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import SpotCard from '../../components/SpotCard';
import {getSpotsAction} from "../../redux/actions/spotsActions";
import {getOpinionsAction} from "../../redux/actions/opinionsActions";

/**
 * Display all of the user's search results that match.
 */
const ResultsScreen = props => {
  const nameInput = props.navigation.getParam('nameInput');
  const areaInput = props.navigation.getParam('areaInput');
  const countryInput = props.navigation.getParam('countryInput');

  // Filter through spots that match the search criteria
  const spots = useSelector(state => {
    return state.spots.spots.filter(spot => {
      let matchesCountry = false;
      let matchesArea = false;
      let matchesName = false;

      if (countryInput === '' || countryInput.toLowerCase() === spot.country.toLowerCase()) {
        matchesCountry = true;
      }
      if ((areaInput === '') || (areaInput.toLowerCase() === spot.area.toLowerCase())) {
        matchesArea = true;
      }
      if ((nameInput === '') || (nameInput.toLowerCase() === spot.name.toLowerCase())) {
        matchesName = true;
      }

      return matchesName && matchesArea && matchesCountry;
    });
  });
  const userId = useSelector(state => state.user.user.localId);
  const dispatch = useDispatch();

  // Get the spots on page load
  useEffect( () => {
    async function getSpots() {
      dispatch(getSpotsAction());
    }
    getSpots().then();

    async function getLikes() {
      await dispatch(getOpinionsAction(userId));
    }
    getLikes().then();
  }, []);

  // Application logic has to be placed here to create a division between the view and business layer
  const spotSelected = (spotName, spotId) => {
    props.navigation.navigate('Spot', {spotName, spotId})
  };

  // Return a view that lists all of the matching spots
  return (
    <View style={styles.browseView}>
      <FlatList
        data={spots}
        keyExtractor={spot => spot.id}
        renderItem={
          spot => (
            <SpotCard
              name={spot.item.name}
              area={spot.item.area}
              country={spot.item.country}
              image={spot.item.image}
              spotSelect={() => {spotSelected(spot.item.name, spot.item.id)}}
            />
          )
        }
      />
    </View>
  )
};

// Styling
const styles = StyleSheet.create({
  browseView: {
    marginHorizontal: 20,
    flex: 1
  },
  headerIcon: {
    marginLeft: 15
  }
});

// Navigation
ResultsScreen.navigationOptions = navigationInfo => {
  return {
    headerTitle: 'Search Results',
    headerTitleStyle: { alignSelf: 'center' }
  }
};

export default ResultsScreen;
