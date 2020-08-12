import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

/*
 * This component is designed as a card when the user views their "Destinations". Each one of
 * these cards will have a preview regarding each destination. They can then be clicked on
 * so that the user is redirected to the full Spot page.
 */
const DestinationCard = props => {

  // Deconstructing variables from props
  const {
    name,
    information,
    area,
    country,
    image,
    destinationSelect
  } = props;

  return (
    <View style={styles.destinationCardView}>
      <TouchableOpacity onPress={destinationSelect}>
        <View style={styles.wrapperView}>
          {/* Display the spot's image at the side*/}
          <View style={styles.imageView}>
            <Image style={styles.destinationImage} source={{ uri: image }} />
          </View>

          {/* Display the rest of the spot's information */}
          <View style={styles.infoWrapper}>
            <View style={styles.destinationInfoView}>
              <Text style={styles.nameText}>
                {name}
              </Text>
              <View style={styles.placeView}>
                <Icon name="md-pin" size={14} />
                <Text style={styles.placeText}>
                  {area}, {country}
                </Text>
              </View>
              <Text style={styles.description} numberOfLines={1}>
                {information}
              </Text>
            </View>
            <View style={styles.rightArrow}>
              <Icon name="md-arrow-dropright" size={16} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
};

// Styling
const styles = StyleSheet.create({
  destinationCardView: {
    marginTop: 10,
    marginHorizontal: 10
  },
  wrapperView: {
    flexDirection: 'row'
  },
  imageView: {
    width: '30%',
    height: 75
  },
  destinationImage: {
    width: '100%',
    height: '100%'
  },
  destinationInfoView: {
    width: '100%',
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 2,
    marginLeft: 10
  },
  infoWrapper: {
    flexDirection: 'row',
    width: '60%'
  },
  placeView: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 10
  },
  placeText: {
    fontSize: 12,
    marginLeft: 5
  },
  description: {
    fontSize: 12
  },
  rightArrow: {
    justifyContent: 'center',
    width: '5%'
  }
});

export default DestinationCard;
