import {LOGIN, LOGOUT, REGISTER} from "../actions/userActions";
import {User} from "../../data/User";

/**
 * Initial state for the user.
 */
const initialState = {
  user: null
};

/**
 * Reducer for the user.
 *
 * @param state   Current state.
 * @param action  Given action.
 */
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER:
      return state;
    case LOGIN:
      const user = new User(action.payload.localId, action.payload.email, action.payload.idToken,
        action.payload.expiresIn, action.payload.destinationsId, action.payload.opinionsId);
      return {
        ...state,
        user
      };
    case LOGOUT:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};

export default userReducer;
