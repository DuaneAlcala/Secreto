
import {secrets} from "../../environments/secrets";

export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOGOUT = 'LOGOUT';

const config = {
  headers: {
    'Content-Type': 'application/json',
  }
};

/**
 * Action that logs a user in.
 *
 * @param email     User email
 * @param password  User password
 */
export const loginAction = (email, password) => {
  return async dispatch => {
    // Create a login request
    const body = JSON.stringify({email, password, returnSecureToken: true});
    const loginRequest = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${secrets.firebaseSecret}`,
      {
        method: 'POST',
        config,
        body
      }
    );
    const userRes = await loginRequest.json();

    if (loginRequest.ok) {
      // If the login was ok, retrieve the user's records for their destinations and opinions
      const destinationsRequest = await fetch(
        `${secrets.firebaseLink}/destinations.json?orderBy="userId"&equalTo="${userRes.localId}"`,
        {
          method: 'GET',
          config
        }
      );
      const destinationsRes = await destinationsRequest.json();
      const destinationsId = Object.keys(destinationsRes)[0];

      const opinionsRequest = await fetch(
        `${secrets.firebaseLink}/opinions.json?orderBy="userId"&equalTo="${userRes.localId}"`,
        {
          method: 'GET',
          config
        }
      );
      const opinionsRes = await opinionsRequest.json();
      const opinionsId = Object.keys(opinionsRes)[0];

      // Deconstruct variables from login response
      const {
        localId,
        email,
        idToken,
        expiresIn
      } = userRes;

      // Dispatch user data to reducer
      dispatch({
        type: LOGIN,
        payload: {
          localId,
          email,
          idToken,
          expiresIn,
          destinationsId,
          opinionsId
        }
      })
    } else {
      // If the login went wrong, send an error to alert the user
      let info = '';
      switch (userRes.error.message) {
        case 'INVALID_PASSWORD':
          info = 'Incorrect email or password';
          break;
        case 'EMAIL_NOT_FOUND':
          info = 'Incorrect email or password';
          break;
        default:
          info = 'Error with logging in';
      }
      throw new Error(info);
    }
  }
};

/**
 * Action that registers a user.
 *
 * @param email     User email
 * @param password  User password
 */
export const registerAction = (email, password) => {
  return async dispatch => {
    // Create a register request
    const body = JSON.stringify({email, password, returnSecureToken: true});
    const registerRequest = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${secrets.firebaseSecret}`,
      {
        method: 'POST',
        config,
        body
      }
    );
    const userRes = await registerRequest.json();

    if (registerRequest.ok) {
      // If the registration was ok, create a record for storing the user's destinations and opinions
      const destinationsBody = JSON.stringify({destinations: [], userId: userRes.localId});
      const destinationsRequest = await fetch(
        `${secrets.firebaseLink}/destinations.json`,
        {
          method: 'POST',
          config,
          body: destinationsBody
        }
      );
      const opinionsBody = JSON.stringify({likes: [], dislikes: [], userId: userRes.localId});
      const opinionsRequest = await fetch(
        `${secrets.firebaseLink}/opinions.json`,
        {
          method: 'POST',
          config,
          body: opinionsBody
        }
      );

      dispatch({
        type: REGISTER
      })
    } else {
      // If the register was denied, send an error to alert the user
      let info = '';
      switch (userRes.error.message) {
        case 'EMAIL_EXISTS':
          info = 'Email already exists';
          break;
        default:
          info = 'Register failed';
      }
      throw new Error(info);
    }
  };
};

/**
 * Action to log out the user.
 */
export const logoutAction = () => {
  return async dispatch => {
    dispatch({
      type: LOGOUT
    })
  };
};
