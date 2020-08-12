import React from 'react';
import {StyleSheet, View, Text, Button, Dimensions} from 'react-native';
const { height } = Dimensions.get('window');

/**
 * This is the screen for the landing page.
 */
const LandingScreen = props => {
  return (
    <View style={styles.landingView}>
      <Text style={styles.welcomeText}>
        Welcome
      </Text>

      <View style={styles.buttonsView}>
        <View style={styles.buttonView}>
          <Button
            title="Login"
            onPress={() => {props.navigation.navigate('Login')}}
          />
        </View>
        <View style={styles.buttonView}>
          <Button
            title="Register"
            onPress={() => {props.navigation.navigate('Register')}}
          />
        </View>
      </View>
    </View>
  )
};

// Styling
const styles = StyleSheet.create({
  landingView: {
    alignItems: 'center',
    marginHorizontal: 25,
    marginTop: height * 0.35
  },
  welcomeText: {
    fontSize: 28,
    marginBottom: 10
  },
  buttonsView: {
    width: '70%'
  },
  buttonView: {
    marginTop: 10
  }
});

// Navigation
LandingScreen.navigationOptions = navigationInfo => {
  return {
    header: null
  }
};

export default LandingScreen;
