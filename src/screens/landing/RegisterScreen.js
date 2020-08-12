import React, {useState} from 'react';
import {StyleSheet, View, Text, ActivityIndicator, TextInput, Alert, Button} from 'react-native';
import {useDispatch} from "react-redux";
import validate from 'validate.js';
import {registerAction} from "../../redux/actions/userActions";

// Register constraints
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
 * Screen for register.
 */
const RegisterScreen = props => {
  const [emailInput, changeEmailInput] = useState('');
  const [validEmail, changeEmailValid] = useState(false);
  const [emailTouched, changeEmailTouched] = useState(false);

  const [passwordInput, changePasswordInput] = useState('');
  const [validPassword, changePasswordValid] = useState(false);
  const [passwordTouched, changePasswordTouched] = useState(false);

  const [registering, changeRegistering] = useState(false);

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

  // Called when the user registers in
  const onRegister = async (email, password) => {
    try {
      changeRegistering(true);
      await dispatch(registerAction(email, password));
      changeRegistering(false);

      Alert.alert('Success', 'You have successfully registered', [{
        text: 'Close'
      }]);
      props.navigation.navigate('Landing');
    } catch (error) {
      // Show register errors if there were any
      Alert.alert('Register Error', error.message, [{
        text: 'Close'
      }]);
      changeRegistering(false);
    }
  };

  return (
    <View style={styles.registerView}>
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

      {/* Show the button for register */}
      {!registering &&
        <View>
          <Button
            title="Register"
            disabled={!validEmail || !validPassword}
            onPress={() => {
              onRegister(emailInput, passwordInput).then()
            }}
          />
        </View>
      }

      {/* If registering, show an activity indicator */}
      {registering &&
        <View style={styles.loadingView}>
          <ActivityIndicator size="large"/>
        </View>
      }
    </View>
  )
};

// Styling
const styles = StyleSheet.create({
  registerView: {
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
  loadingView: {
    backgroundColor: '#4C96F2',
    width: '100%',
    height: 40
  }
});

// Navigation
RegisterScreen.navigationOptions = navigationInfo => {
  return {
    headerTitle: 'Register',
  }
};

export default RegisterScreen;
