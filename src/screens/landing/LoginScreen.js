import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import validate from 'validate.js';
import {loginAction} from "../../redux/actions/userActions";

// Login constraints
const constraints = {
  email: {
    presence: {
      message: 'Please enter a valid email address'
    },
    email: {
      message: 'Please enter a valid email address'
    }
  },
  password: {
    presence: {
      message: 'Password must be at least 6 characters'
    },
    length: {
      minimum: 6,
      message: 'Password must be at least 6 characters'
    }
  }
};

/**
 * This is the screen for login.
 */
const LoginScreen = props => {
  const [emailInput, changeEmailInput] = useState('');
  const [validEmail, changeEmailValid] = useState(false);
  const [emailTouched, changeEmailTouched] = useState(false);

  const [passwordInput, changePasswordInput] = useState('');
  const [validPassword, changePasswordValid] = useState(false);
  const [passwordTouched, changePasswordTouched] = useState(false);

  const [loggingIn, changeLogging] = useState(false);

  // Check for email validity and change
  const checkEmailInput = (input) => {
    changeEmailInput(input);
    const result = validate({email: emailInput}, constraints);
    if (result.email) {
      changeEmailValid(false);
    } else if (!result.email) {
      changeEmailValid(true);
    }
  };

  // Check for password validity and change
  const checkPasswordInput = (input) => {
    changePasswordInput(input);
    const result = validate({password: passwordInput}, constraints);
    if (result.password) {
      changePasswordValid(false);
    } else if (!result.password) {
      changePasswordValid(true);
    }
  };

  const dispatch = useDispatch();

  // Called when the user logs in
  const onLogin = async (email, password) => {
    try {
      changeLogging(true);
      await dispatch(loginAction(email, password));

      changeLogging(false);
      props.navigation.navigate('Browse');
    } catch (error) {
      // Show login errors if there were any
      Alert.alert('Login Error', error.message, [{
        text: 'Close'
      }]);
      changeLogging(false);
    }
  };

  return (
    <View style={styles.loginView}>
      {/* Create input for email */}
      <View style={styles.inputView}>
        <Text>
          Email
        </Text>
        <TextInput
          style={styles.textInput}
          email
          value={emailInput}
          onChangeText={input => checkEmailInput(input)}
          onBlur={() => {
            changeEmailTouched(true);
          }}
        />
        {emailTouched && !validEmail &&
          <Text style={styles.error}>Please enter a valid email address</Text>
        }
      </View>

      {/* Create input for password */}
      <View style={styles.inputView}>
        <Text>
          Password
        </Text>
        <TextInput
          password
          value={passwordInput}
          onChangeText={input => checkPasswordInput(input)}
          style={styles.textInput}
          onBlur={() => {
            changePasswordTouched(true);
          }}
          secureTextEntry={true}
        />
        {passwordTouched && !validPassword &&
          <View>
            <Text style={styles.error}>Password must be at least 6 characters</Text>
          </View>
        }
      </View>

      {/* Show the button for login */}
      {!loggingIn &&
      <View>
        <Button
          title="Login"
          disabled={!validEmail || !validPassword}
          onPress={() => {
            onLogin(emailInput, passwordInput).then();
          }}
        />
      </View>
      }

      {/* If logging in, show an activity indicator */}
      {loggingIn &&
      <View style={styles.loadingView}>
        <ActivityIndicator size="large"/>
      </View>
      }

      <View style={styles.registerTextWrapper}>
        <TouchableOpacity onPress={() => {props.navigation.navigate('Register')}}>
          <View styles={styles.test}>
            <Text style={styles.registerText}>
              Don't have an account? Register One!
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
};

// Styling
const styles = StyleSheet.create({
  loginView: {
    justifyContent: 'center',
    marginHorizontal: 25,
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
  registerTextWrapper: {
    alignItems: 'center'
  },
  registerText: {
    fontSize: 14,
    color: 'blue',
    marginTop: 20
  }
});

// Navigation
LoginScreen.navigationOptions = navigationInfo => {
  return {
    headerTitle: 'Login',
    headerTitleStyle: { alignSelf: 'center' }
  }
};

export default LoginScreen;
