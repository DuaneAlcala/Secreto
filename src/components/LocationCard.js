import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

/*
 * This component is designed as a card for each location that the user has submitted
 * in the "Locations" screen. It will preview some information about each location such as
 * the image and its name.
 */
const LocationCard = props => {

  // Deconstructing variables from props
  const {
    name,
    image,
    locationSelect
  } = props;

  // Return JSX with a card that previews name and image, along with a touchable component
  return (
    <View style={styles.locationCardView}>
      <TouchableOpacity onPress={locationSelect}>
        <View style={styles.wrapperView}>
          <View style={styles.imageView}>
            <Image style={styles.locationImage} source={{ uri: image }} />
          </View>
          <View style={styles.nameView}>
            <Text style={styles.nameText}>
              {name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
};

// Styling
const styles = StyleSheet.create({
  locationCardView: {
    backgroundColor: 'white',
    marginTop: 10
  },
  wrapperView: {
    flexDirection: 'row'
  },
  imageView: {
    width: '20%',
    height: 50
  },
  locationImage: {
    width: '100%',
    height: '100%'
  },
  nameView: {
    marginLeft: 15,
    justifyContent: 'center'
  },
  nameText: {
    fontSize: 20
  }
});

export default LocationCard;
