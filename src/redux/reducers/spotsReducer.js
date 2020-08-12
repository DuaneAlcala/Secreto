import {Spot} from '../../data/Spot';
import {
  ADD_LOCATION, DELETE_LOCATION, DISLIKE_SPOT, EDIT_LOCATION,
  GET_DESTINATIONS,
  GET_LOCATIONS, LIKE_SPOT,
  LOAD_SPOTS, POST_COMMENT,
  REMOVE_DESTINATION, REMOVE_DISLIKE, REMOVE_LIKE,
  SAVE_DESTINATION
} from "../actions/spotsActions";

/**
 * Initial state for spots, locations, and destinations.
 */
const initialState = {
  spots: [],
  locations: [],
  destinations: []
};

/**
 * Reducer for spots.
 *
 * @param state   Current state.
 * @param action  Given action.
 */
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      return {
        ...state,
        spots: action.payload.spots
      };
    case GET_LOCATIONS:
      return {
        ...state,
        locations: action.payload.locations
      };
    case ADD_LOCATION:
      // Deconstruct from payload
      const {
        name,
        information,
        address,
        area,
        country,
        image,
        latitude,
        longitude,
        spotId,
        userId,
        likes,
        dislikes,
        comments
      } = action.payload;

      // Create a new location and update the state
      const location = new Spot(name, information, address, area, country, image, latitude, longitude,
        spotId, userId, likes, dislikes, comments);

      return {
        ...state,
        spots: state.spots.concat(location),
        locations: state.locations.concat(location)
      };
    case EDIT_LOCATION:
    case LIKE_SPOT:
    case REMOVE_LIKE:
    case DISLIKE_SPOT:
    case REMOVE_DISLIKE:
    case POST_COMMENT:
      // Find the ID of the spot and update it with the new content
      const id = action.payload.newSpot.id;
      const spotPos = state.spots.findIndex(spot => spot.id === id);
      const locationPos = state.locations.findIndex(location => location.id === id);

      const newSpots = [...state.spots];
      const newLocations = [...state.locations];

      // Replace the old spot with the one with new content
      newSpots[spotPos] = action.payload.newSpot;
      if (locationPos !== -1) {
        newLocations[locationPos] = action.payload.newSpot;
      }

      return {
        ...state,
        spots: newSpots,
        locations: newLocations
      };
    case DELETE_LOCATION:
      // Find the location to be deleted and update the state
      const deletedId = action.payload.spotId;
      const filteredSpots = [...state.spots].filter(spot => spot.id !== deletedId);
      const filteredLocations = [...state.locations].filter(spot => spot.id !== deletedId);

      return {
        ...state,
        spots: filteredSpots,
        locations: filteredLocations
      };
    case GET_DESTINATIONS:
    case SAVE_DESTINATION:
    case REMOVE_DESTINATION:
      return {
        ...state,
        destinations: action.payload.destinations
      };
    default:
      return state;
  }
};

export default spotsReducer;
