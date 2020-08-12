import React, {useEffect} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import SpotCard from '../../components/SpotCard';
import {getSpotsAction} from "../../redux/actions/spotsActions";
import {getOpinionsAction} from "../../redux/actions/opinionsActions";

/**
 * The browse screen where the user can see all the spots.
 */
const BrowseScreen = props => {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.spots);
  const userId = useSelector(state => state.user.user.localId);

  // Load spots when on page
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

  return (
    <View style={styles.browseView}>
      {/* Creating a FlatList here to display all of the spots */}
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
BrowseScreen.navigationOptions = navigationInfo => {
  return {
    header: null
  }
};

export default BrowseScreen;
