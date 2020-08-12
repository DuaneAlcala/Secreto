import React from 'react';
import {StyleSheet, View, Button, TouchableOpacity, Text, Image} from 'react-native';

/*
 * A card component for each spot. It will preview the image, name, area, and country
 * of the spot.
 */
const SpotCard = props => {

  // Deconstructing from props
  const {
    name,
    area,
    country,
    image,
    spotSelect,
  } = props;

  // Return a card that shows the image, name, area, and country of a spot along with a touchable component
  return (
    <View style={styles.cardView}>
      <TouchableOpacity onPress={spotSelect}>
        <View style={styles.wrapperView}>
          <View style={styles.spotInfoView}>
            <Text style={styles.spotNameText}>
              {name}
            </Text>
            <Text style={styles.spotLocationText}>
              {area}, {country}
            </Text>
          </View>
          <View style={styles.imageView}>
            <Image
              style={{ width: '100%', height: '100%' }}
              source={{ uri: image }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
};

// Styling
const styles = StyleSheet.create({
  cardView: {
    // Trying to remake ionic cards
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    height: 275,
    shadowColor: 'black',
    elevation: 5,
    shadowOpacity: 0.5,
    marginHorizontal: 10,
    shadowRadius: 10,
    marginVertical: 20
  },
  wrapperView: {

  },
  spotInfoView: {
    alignItems: 'center',
    height: '25%',
    width: '100%',
    marginTop: 15
  },
  spotNameText: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10
  },
  spotLocationText: {
    color: '#181818'
  },
  imageView: {
    height: '75%',
    width: '100%'
  }
});

export default SpotCard;
