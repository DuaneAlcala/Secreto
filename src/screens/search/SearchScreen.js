import React, {useState} from 'react';
import { StyleSheet, View, Button, Text, TextInput } from 'react-native';

/**
 * Search screen.
 */
const SearchScreen = props => {
  // Input fields for search
  const [nameInput, changeNameInput] = useState('');
  const [validName, changeNameValid] = useState(false);

  const [areaInput, changeAreaInput] = useState('');
  const [validArea, changeAreaValid] = useState(false);

  const [countryInput, changeCountryInput] = useState('');
  const [validCountry, changeCountryValid] = useState(false);

  // Checks for input validity and updates the input field
  const checkInput = (input, changeFunction, validFunction) => {
    changeFunction(input);
    const isEmpty = input.trim().length === 0;

    if (isEmpty) {
      validFunction(false);
    } else {
      validFunction(true);
    }
  };

  // Called when the search button is pressed
  const doSearch = () => {
    props.navigation.navigate('Results', {nameInput, areaInput, countryInput})
  };

  return (
    <View style={styles.searchView}>
      <View style={styles.inputView}>
        <Text>
          Name
        </Text>
        <TextInput
          style={styles.textInput}
          value={nameInput}
          onChangeText={input => checkInput(input, changeNameInput, changeNameValid)}
        />
      </View>
      <View style={styles.inputView}>
        <Text>
          Area
        </Text>
        <TextInput
          style={styles.textInput}
          value={areaInput}
          onChangeText={input => checkInput(input, changeAreaInput, changeAreaValid)}
        />
      </View>
      <View style={styles.inputView}>
        <Text>
          Country
        </Text>
        <TextInput
          style={styles.textInput}
          value={countryInput}
          onChangeText={input => checkInput(input, changeCountryInput, changeCountryValid)}
        />
      </View>
      <View style={styles.submitButtonWrapper}>
        <View style={styles.submitButtonView}>
          <Button
            title="Search"
            disabled={!validName && !validArea && !validCountry}
            onPress={() => {
              doSearch()
            }} />
        </View>
      </View>
    </View>
  )
};

// Styling
const styles = StyleSheet.create({
  searchView: {
    marginHorizontal: 20,
    marginTop: 20
  },
  inputView: {
    marginBottom: 20
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD'
  },
  error: {
    color: 'red'
  },
  headerIcon: {
    marginLeft: 15
  }
});

// Navigation
SearchScreen.navigationOptions = navigationInfo => {
  return {
    headerTitle: 'Search',
    headerTitleStyle: { alignSelf: 'center' }
  }
};

export default SearchScreen;
