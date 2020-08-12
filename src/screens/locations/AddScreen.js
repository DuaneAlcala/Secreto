import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {useDispatch, useSelector} from "react-redux";
import * as firebase from 'firebase';
import MapView, {Marker, Callout} from 'react-native-maps';

import UPLOAD_IMAGE from "../../assets/images/upload.png";
import {addSpotAction} from "../../redux/actions/spotsActions";

/**
 * Screen for adding a location.
 */
const AddScreen = props => {
  const userId = useSelector(state => state.user.user.localId);

  // Fields for input
  const [nameInput, changeNameInput] = useState('');
  const [validName, changeNameValid] = useState(false);
  const [nameTouched, changeNameTouched] = useState(false);

  const [addressInput, changeAddressInput] = useState('');
  const [validAddress, changeAddressValid] = useState(false);
  const [addressTouched, changeAddressTouched] = useState(false);

  const [infoInput, changeInfoInput] = useState('');
  const [validInfo, changeInfoValid] = useState(false);
  const [infoTouched, changeInfoTouched] = useState(false);

  const [areaInput, changeAreaInput] = useState('');
  const [validArea, changeAreaValid] = useState(false);
  const [areaTouched, changeAreaTouched] = useState(false);

  const [countryInput, changeCountryInput] = useState('');
  const [validCountry, changeCountryValid] = useState(false);
  const [countryTouched, changeCountryTouched] = useState(false);

  const [latitude, changeLatitude] = useState(null);
  const [longitude, changeLongitude] = useState(null);

  const [imageInput, changeImage] = useState(UPLOAD_IMAGE);
  const [marker, changeMarker] = useState(null);
  const [addLoading, changeLoading] = useState(false);

  // Called when coordinates are selected on a map
  const selectCoordinates = (coordinates) => {
    const {latitude, longitude} = coordinates;
    changeMarker(coordinates);
    changeLatitude(latitude);
    changeLongitude(longitude);
  };

  // Checks for a valid field input and updates it
  const checkInput = (input, changeFunction, validFunction, touchedFunction) => {
    changeFunction(input);
    touchedFunction(true);
    const isEmpty = input.trim().length === 0;

    if (isEmpty) {
      validFunction(false);
    } else {
      validFunction(true);
    }
  };

  // Update the image preview
  const changePhoto = () => {
    ImagePicker.launchImageLibrary({noData: true}, response => {
      if (response.uri) {
        changeImage({ uri: response.uri });
      }
    })
  };

  const dispatch = useDispatch();

  // Call method for new location dispatch when the button for adding is pressed
  const addLocation = async () => {
    changeLoading(true);
    const dateString = new Date().getTime().toString();
    const imageName = `${(imageInput.uri).toString()}_${(dateString)}`;
    const imageUri = await fetch(imageInput.uri);
    const imageBlob = await imageUri.blob();

    // Upload the image to firebase and then get the download URL
    const firebaseRef = firebase.storage().ref().child(`images/${imageName}`);
    await firebaseRef.put(imageBlob);
    await firebaseRef.getDownloadURL().then(imageLink => {
      // Dispatch the new location
      dispatch(addSpotAction(nameInput, infoInput, addressInput, areaInput, countryInput, imageLink, latitude, longitude, userId))
    });
    changeLoading(false);
    props.navigation.navigate('Locations');
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.addView}>
          {/* View for storing the image preview */}
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              source={imageInput}
            />
          </View>
          <View style={styles.uploadButtonWrapper}>
            <View style={styles.uploadButtonView}>
              <Button title="Upload Image" color="gray" onPress={() => {changePhoto()}} />
            </View>
          </View>

          {/* Create input for name */}
          <View style={styles.inputView}>
            <Text>
              Name
            </Text>
            <TextInput
              style={styles.textInput}
              value={nameInput}
              onChangeText={input => checkInput(input, changeNameInput, changeNameValid, changeNameTouched)}
              onBlur={() => {
                changeNameTouched(true);
              }}
            />
            {nameTouched && !validName &&
              <View>
                <Text style={styles.error}>Please enter a name for the spot</Text>
              </View>
            }
          </View>

          {/* Create input for address */}
          <View style={styles.inputView}>
            <Text>
              Address
            </Text>
            <TextInput
              style={styles.textInput}
              value={addressInput}
              onChangeText={input => checkInput(input, changeAddressInput, changeAddressValid, changeAddressTouched)}
              onBlur={() => {
                changeAddressTouched(true);
              }}
            />
            {addressTouched && !validAddress &&
              <View>
                <Text style={styles.error}>Please enter an address</Text>
              </View>
            }
          </View>

          {/* Create input for information */}
          <View style={styles.inputView}>
            <Text>
              Information
            </Text>
            <TextInput
              style={styles.textInput}
              numberOfLines={3}
              value={infoInput}
              onChangeText={input => checkInput(input, changeInfoInput, changeInfoValid, changeInfoTouched)}
              onBlur={() => {
                changeInfoTouched(true);
              }}
            />
            {infoTouched && !validInfo &&
              <View>
                <Text style={styles.error}>Please enter information about the spot</Text>
              </View>
            }
          </View>

          {/* Create input for area */}
          <View style={styles.inputView}>
            <Text>
              Area
            </Text>
            <TextInput
              style={styles.textInput}
              value={areaInput}
              onChangeText={input => checkInput(input, changeAreaInput, changeAreaValid, changeAreaTouched)}
              onBlur={() => {
                changeAreaTouched(true);
              }}
            />
            {areaTouched && !validArea &&
              <View>
                <Text style={styles.error}>Please enter the area</Text>
              </View>
            }
          </View>

          {/* Create input for country */}
          <View style={styles.inputView}>
            <Text>
              Country
            </Text>
            <TextInput
              style={styles.textInput}
              value={countryInput}
              onChangeText={input => checkInput(input, changeCountryInput, changeCountryValid, changeCountryTouched)}
              onBlur={() => {
                changeCountryTouched(true);
              }}
            />
            {countryTouched && !validCountry &&
            <View>
              <Text style={styles.error}>Please enter the country</Text>
            </View>
            }
          </View>

          {/* Create view for the map */}
          <View style={styles.mapWrapper}>
            <Text style={styles.mapHeader}>Map The Spot</Text>
            <MapView
              style={styles.map}
              initialRegion={{
               latitude: 37.78825,
               longitude: -122.4324,
               latitudeDelta: 0.0922,
               longitudeDelta: 0.0421,
              }}
              onPress={(e) => {selectCoordinates(e.nativeEvent.coordinate)}}
            >
              {marker &&
              <MapView.Marker coordinate={marker} />}
            </MapView>
          </View>

          {/* Create input for the submission button */}
          <View>
            <View style={styles.submitButtonWrapper}>
              <View style={styles.submitButtonView}>
                {!addLoading &&
                <Button
                  title="Add Spot!"
                  disabled={!validName || !validAddress || !validInfo || !validArea || !validCountry || !imageInput.uri}
                  onPress={() => {
                    addLocation()
                  }}/>
                }
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {addLoading &&
      <View style={styles.whileAddingView}>
        <ActivityIndicator size='large' />
        <Text style={styles.loadingText}>Adding Spot...</Text>
      </View>
      }
    </View>
  )
};

// Styling
const styles = StyleSheet.create({
  addView: {
    marginHorizontal: 20
  },
  imageView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    height: 250,
    borderColor: '#DDDDDD',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  uploadButtonWrapper: {
    alignItems: 'center',
    marginVertical: 10
  },
  uploadButtonView: {
    width: '60%'
  },
  inputView: {
    marginBottom: 20
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD'
  },
  countryInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingVertical: 15
  },
  countryText: {
    marginLeft: 3
  },
  mapWrapper: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  mapHeader: {
    fontSize: 16,
    marginBottom: 10
  },
  map: {
    width: '100%',
    height: 250
  },
  submitButtonWrapper: {
    alignItems: 'center'
  },
  submitButtonView: {
    width: '80%',
    marginVertical: 10
  },
  error: {
    color: 'red'
  },
  whileAddingView: {
    alignItems: 'center',
    left: 0,
    right: 0,
    top: 0,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    backgroundColor: '#DDDDDD'
  },
  loadingText: {
    fontSize: 20
  }
});

// Navigation
AddScreen.navigationOptions = navigationInfo => {
  return {
    headerTitle: 'Add A Spot!',
    headerTitleStyle: { alignSelf: 'center' }
  }
};

export default AddScreen;
