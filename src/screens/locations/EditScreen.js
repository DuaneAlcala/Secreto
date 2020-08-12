import React, {useState} from 'react';
import {StyleSheet, View, Text, Button, TextInput, ScrollView, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {editLocationAction} from "../../redux/actions/spotsActions";

/**
 * Screen for editing a location
 */
const EditScreen = props => {
  const spotId = props.navigation.getParam('spotId');
  const location = useSelector(state => {
    return state.spots.locations.find(loc => loc.id === spotId);
  });
  const userId = useSelector(state => state.user.user.localId);

  // Input fields
  const [nameInput, changeNameInput] = useState(location.name);
  const [validName, changeNameValid] = useState(true);
  const [nameTouched, changeNameTouched] = useState(false);

  const [addressInput, changeAddressInput] = useState(location.address);
  const [validAddress, changeAddressValid] = useState(true);
  const [addressTouched, changeAddressTouched] = useState(false);

  const [infoInput, changeInfoInput] = useState(location.information);
  const [validInfo, changeInfoValid] = useState(true);
  const [infoTouched, changeInfoTouched] = useState(false);

  const [areaInput, changeAreaInput] = useState(location.area);
  const [validArea, changeAreaValid] = useState(true);
  const [areaTouched, changeAreaTouched] = useState(false);

  const [countryInput, changeCountryInput] = useState(location.country);
  const [validCountry, changeCountryValid] = useState(true);
  const [countryTouched, changeCountryTouched] = useState(false);

  const [editLoading, changeLoading] = useState(false);

  const dispatch = useDispatch();

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

  // Call method for update location dispatch when the button for adding is pressed
  const editLocation = async () => {
    try {
      changeLoading(true);
      await dispatch(editLocationAction(nameInput, infoInput, addressInput, areaInput, countryInput, location.image,
        location.latitude, location.longitude, spotId, userId, location.likes, location.dislikes, location.comments));
      changeLoading(false);
      props.navigation.navigate('Locations');
    } catch {

    }
  };

  return (
    <ScrollView>
      <View style={styles.editView}>
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
            <Text style={styles.error}>Please enter the area</Text>
          </View>
          }
        </View>
        <View style={styles.submitButtonWrapper}>
          <View style={styles.submitButtonView}>
            <Button
              title="Edit Spot!"
              disabled={(!validName || !validAddress || !validInfo || !validArea || !validCountry) ||
              (!nameTouched && !addressTouched && !infoTouched && !areaTouched && !countryTouched)}
              onPress={() => {
                editLocation();
              }} />
          </View>
        </View>
      </View>
      {editLoading &&
        <View style={styles.whileEditingView}>
          <ActivityIndicator size='large' />
          <Text style={styles.loadingText}>Editing Spot...</Text>
        </View>
      }
    </ScrollView>
  )
};

// Styling
const styles = StyleSheet.create({
  editView: {
    marginHorizontal: 20,
    marginTop: 20
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
  whileEditingView: {
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
EditScreen.navigationOptions = navigationInfo => {
  return {
    headerTitleStyle: { alignSelf: 'center' },
    headerTitle: `Editing ${navigationInfo.navigation.getParam('spotName')}`
  }
};

export default EditScreen;
