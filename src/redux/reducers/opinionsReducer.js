import {DISLIKING_SPOT, GET_OPINIONS, LIKING_SPOT, UNDISLIKING_SPOT, UNLIKING_SPOT} from "../actions/opinionsActions";

/**
 * Initial state for opinions.
 */
const initialState = {
  likes: [],
  dislikes: []
};

/**
 * Reducer for opinions.
 *
 * @param state   Current state.
 * @param action  Given action.
 */
const opinionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_OPINIONS:
    case LIKING_SPOT:
    case UNLIKING_SPOT:
    case DISLIKING_SPOT:
    case UNDISLIKING_SPOT:
      // Update the state of the user's likes and dislikes
      return {
        ...state,
        likes: action.payload.likes,
        dislikes: action.payload.dislikes
      };
    default:
      return state;
  }
};

export default opinionsReducer;
