import {secrets} from "../../environments/secrets";
import {Spot} from "../../data/Spot";

export const LOAD_SPOTS = 'LOAD_SPOTS';
export const GET_LOCATIONS = 'GET_LOCATIONS';
export const ADD_LOCATION = 'ADD_LOCATION';
export const EDIT_LOCATION = 'EDIT_LOCATION';
export const DELETE_LOCATION = 'DELETE_LOCATION';
export const POST_COMMENT = 'POST_COMMENT';
export const GET_DESTINATIONS = 'GET_DESTINATIONS';
export const SAVE_DESTINATION = 'SAVE_DESTINATION';
export const REMOVE_DESTINATION = 'REMOVE_DESTINATION';

export const LIKE_SPOT = 'LIKE_SPOT';
export const REMOVE_LIKE = 'REMOVE_LIKE';
export const DISLIKE_SPOT = 'DISLIKE_SPOT';
export const REMOVE_DISLIKE = 'REMOVE_DISLIKE';

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Generates spot objects from JSON responses.
 *
 * @param spotRes JSON response of spots
 *
 * @returns Spot objects
 */
function createSpots(spotRes) {
  const spots = [];
  for (const spot in spotRes) {
    if (spotRes.hasOwnProperty(spot)) {
      // Check if there are coordinates, and if there are comments. Set to default values if none.
      const latitude = spotRes[spot].latitude === undefined ? null : spotRes[spot].latitude;
      const longitude = spotRes[spot].longitude === undefined  ? null : spotRes[spot].longitude;
      let comments = spotRes[spot].comments;
      if (comments === undefined) {
        comments = [];
      }

      // Create a new spot
      const newSpot = new Spot(
        spotRes[spot].name,
        spotRes[spot].information,
        spotRes[spot].address,
        spotRes[spot].area,
        spotRes[spot].country,
        spotRes[spot].image,
        latitude,
        longitude,
        spot,
        spotRes[spot].userId,
        spotRes[spot].likes,
        spotRes[spot].dislikes,
        comments);
      spots.push(newSpot);
    }
  }
  return spots;
}

/**
 * Gets all the spots.
 */
export const getSpotsAction = () => {
  return async dispatch => {
    // Make a fetch request to retrieve all the spots and load them
    const spotsRequest = await fetch(`${secrets.firebaseLink}/spots.json`,
    {
      method: 'GET',
      config
    });
    const spotsRes = await spotsRequest.json();
    const spots = createSpots(spotsRes);

    // Dispatch spots to reducer
    dispatch({
      type: LOAD_SPOTS,
      payload: {
        spots
      }
    })
  }
};

/**
 * Get all of the current user's submitted locations.
 *
 * @param userId The user's ID
 */
export const getLocationsAction = (userId) => {
  return async dispatch => {
    // Make a fetch request to retrieve all of the user's locations
    const locationsRequest = await fetch(`${secrets.firebaseLink}/spots.json?orderBy="userId"&equalTo="${userId}"`,
      {
        method: 'GET',
        config
      });
    const locationsRes = await locationsRequest.json();
    const locations = createSpots(locationsRes);

    // Sorting locations in alphabetical order
    locations.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });

    // Dispatch locations to reducer
    dispatch({
      type: GET_LOCATIONS,
      payload: {
        locations
      }
    })
  }
};

/**
 * Action to add a spot.
 *
 * @param name          Name of the spot
 * @param information   Information about the spot
 * @param address       Address of the spot
 * @param area          Area of the spot
 * @param country       Country of the spot
 * @param image         Image of the spot
 * @param latitude      Latitude of the spot
 * @param longitude     Longitude of the spot
 * @param userId        The current user's ID
 */
export const addSpotAction = (name, information, address, area, country, image, latitude, longitude, userId) => {
  return async dispatch => {
    // Create a fetch request to add a spot to the database
    const body = JSON.stringify({name, information, address, area, country, image, latitude, longitude, userId, likes: 0, dislikes: 0, comments: []});
    const addRequest = await fetch(
      `${secrets.firebaseLink}/spots.json`,
      {
        method: 'POST',
        config,
        body
      }
    );
    // Retrieve the spot ID
    const addRes = await addRequest.json();
    const spotId = Object.keys(addRes)[0];

    // Dispatch the new spot along with its new ID to the reducer
    dispatch({
      type: ADD_LOCATION,
      payload: {
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
        likes: 0,
        dislikes: 0,
        comments: []
      }
    })
  }
};

/**
 * Action to edit a spot's details.
 *
 * @param name          Name of the spot
 * @param information   Information about the spot
 * @param address       Address of the spot
 * @param area          Area of the spot
 * @param country       Country of the spot
 * @param image         Image of the spot
 * @param latitude      Latitude of the spot
 * @param longitude     Longitude of the spot
 * @param id            ID of the spot
 * @param userId        The current user's ID
 * @param likes         The number of likes a spot has
 * @param dislikes      The number of dislikes a spot has
 * @param comments      The comments of the spot
 */
export const editLocationAction = (name, information, address, area, country, image, latitude, longitude, id, userId, likes, dislikes, comments) => {
  return async dispatch => {
    // Create a fetch request to edit a spot to the database
    const editBody = JSON.stringify({name, information, address, area, country, image, latitude, longitude, userId, likes, dislikes, comments});
    const editRequest = await fetch(
      `${secrets.firebaseLink}/spots/${id}.json`,
      {
        method: 'PUT',
        config,
        body: editBody
      }
    );
    // Create a new spot object and dispatch it to the reducer
    const location = new Spot(name, information, address, area, country, image, latitude, longitude, id, userId, likes, dislikes, comments);

    dispatch({
      type: EDIT_LOCATION,
      payload: {
        newSpot: location
      }
    });
  };
};

/**
 * Actions to delete a spot.
 *
 * @param spotId The spot's ID to be deleted
 */
export const deleteLocationAction = (spotId) => {
  return async dispatch => {
    // Create a fetch request for delete and then dispatch the ID to the reducer for removal.
    const deleteRequest = await fetch(
      `${secrets.firebaseLink}/spots/${spotId}.json`,
      {
        method: 'DELETE',
        config
      }
    );

    dispatch({
      type: DELETE_LOCATION,
      payload: {
        spotId
      }
    })
  }
};

/**
 * Action called when the user has an opinion about the spot eg. like, unlike, dislike, undislike.
 *
 * @param spot        The spot
 * @param opinionType Type of opninion the user has
 */
export const opinionAction = (spot, opinionType) => {
  return async dispatch => {
    const {
      name,
      information,
      address,
      area,
      country,
      image,
      latitude,
      longitude,
      id,
      userId,
      dislikes,
      comments
    } = spot;

    let {
      likes
    } = spot;

    if (opinionType === LIKE_SPOT) {
      // If the user liked, increase the number of likes
      ++likes;
      const newSpot = new Spot(name, information, address, area, country, image, latitude, longitude,
        id, userId, likes, dislikes, comments);
      dispatch({
        type: LIKE_SPOT,
        payload: {
          newSpot
        }
      });
    } else if (opinionType === REMOVE_LIKE) {
      // If the user unliked, decrease the number of likes
      --likes;
      const newSpot = new Spot(name, information, address, area, country, image, latitude, longitude,
        id, userId, likes, dislikes, comments);
      dispatch({
        type: REMOVE_LIKE,
        payload: {
          newSpot
        }
      });
    }

    // Create a fetch request to update the database
    const editBody = JSON.stringify({name, information, address, area, country, image, latitude, longitude, userId, likes, dislikes, comments});
    const putOpinionRequest = await fetch(
      `${secrets.firebaseLink}/spots/${id}.json`,
      {
        method: 'PUT',
        config,
        body: editBody
      }
    );
  };
};

/**
 * Action called when the user posts a comment on the spot.
 *
 * @param spot      The spot
 * @param comments  New comments
 */
export const postCommentAction = (spot, comments) => {
  return async dispatch => {
    const {
      name,
      information,
      address,
      area,
      country,
      image,
      latitude,
      longitude,
      id,
      userId,
      likes,
      dislikes,
    } = spot;

    // Create fetch request and update comments
    const editBody = JSON.stringify({name, information, address, area, country, image, latitude, longitude, userId, likes, dislikes, comments});
    const commentRequest = await fetch(
      `${secrets.firebaseLink}/spots/${id}.json`,
      {
        method: 'PUT',
        config,
        body: editBody
      }
    );

    const newSpot = new Spot(name, information, address, area, country, image, latitude, longitude, id, userId, likes, dislikes, comments);
    dispatch({
      type: POST_COMMENT,
      payload: {
        newSpot
      }
    })
  };
};

/**
 * Gets all of the current user's destinations.
 *
 * @param userId The current user's ID
 */
export const getDestinationsAction = (userId) => {
  return async dispatch => {
    // Create a fetch request to get all destinations
    const destinationsRequest = await fetch(
      `${secrets.firebaseLink}/destinations.json?orderBy="userId"&equalTo="${userId}"`,
      {
        method: 'GET',
        config
      }
    );
    const destinationsRes = await destinationsRequest.json();
    const key = Object.keys(destinationsRes)[0];

    const destinations = [];
    if(!destinationsRes[key].hasOwnProperty('destinations')) {
      // If the user has no saved destinations, dispatch to reducer with none
      dispatch({
        type: GET_DESTINATIONS,
        payload: {
          destinations
        }
      })
    } else {
      // If the user has saved destinations, create them
      const destinationIds = destinationsRes[key].destinations;
      if (destinationsRes.destinations !== null) {
        for (const id of destinationIds) {
          const spotRequest = await fetch(`${secrets.firebaseLink}/spots/${id}.json`);

          if (spotRequest.ok) {
            const spotData = await spotRequest.json();
            const {
              name,
              information,
              address,
              area,
              country,
              image,
              latitude,
              longitude,
              userId,
              likes,
              dislikes,
              comments
            } = spotData;
            destinations.push(new Spot(name, information, address, area, country, image, latitude, longitude, id, userId, likes, dislikes, comments));

            dispatch({
              type: GET_DESTINATIONS,
              payload: {
                destinations
              }
            })
          }
        }
      }
    }
  };
};

/**
 * Actions that saves a spot as one of the user's destinations.
 *
 * @param userId          The current user's ID
 * @param spot            The spot ID
 * @param destinationsId  The ID of their destination's record
 */
export const saveDestinationAction = (userId, spot, destinationsId) => {
  return async (dispatch, getState) => {
    const { destinations } = getState().spots;

    // Add the saved destination
    const destinationIds = [];
    for (const destination of destinations) {
      destinationIds.push(destination.id);
    }
    destinations.push(spot);
    destinationIds.push(spot.id);

    // Create a fetch request to update the user's destinations
    const saveBody = JSON.stringify({destinations: destinationIds, userId});
    const destSaveRequest = await fetch(
      `${secrets.firebaseLink}/destinations/${destinationsId}.json`,
      {
        method: 'PUT',
        config,
        body: saveBody
      }
    );

    // Dispatch new destinations to reducer
    dispatch({
      type: SAVE_DESTINATION,
      payload: {
        destinations
      }
    });
  };
};

/**
 * Actions that removed a spot from one of the user's destinations.
 *
 * @param userId          The current user's ID
 * @param spot            The spot ID
 * @param destinationsId  The ID of their destination's record
 */
export const removeDestinationAction = (userId, spot, destinationsId) => {
  return async (dispatch, getState) => {
    let { destinations } = getState().spots;

    // Remove the destination
    const destinationIds = [];
    destinations = destinations.filter(dest => dest.id !== spot.id);
    for (const destination of destinations) {
      destinationIds.push(destination.id);
    }

    // Create a fetch request to update the user's destinations
    const removeBody = JSON.stringify({destinations: destinationIds, userId});
    const destRemoveRequest = await fetch(
      `${secrets.firebaseLink}/destinations/${destinationsId}.json`,
      {
        method: 'PUT',
        config,
        body: removeBody
      }
    );

    // Dispatch new set of destinations to reducer
    dispatch({
      type: REMOVE_DESTINATION,
      payload: {
        destinations
      }
    });
  }
};
