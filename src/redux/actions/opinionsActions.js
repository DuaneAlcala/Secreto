import {secrets} from "../../environments/secrets";

export const GET_OPINIONS = 'GET_OPINIONS';
export const LIKING_SPOT = 'LIKING_SPOT';
export const UNLIKING_SPOT = 'UNLIKING_SPOT';
export const DISLIKING_SPOT = 'DISLIKING_SPOT';
export const UNDISLIKING_SPOT = 'UNDISLIKING_SPOT';

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Action to get a user's opinions (likes and dislikes) by doing a fetch request
 * to the database.
 *
 * @param userId The user's id
 */
export const getOpinionsAction = (userId) => {
  return async dispatch => {
    // Create fetch request and extract likes and dislikes
    const opinionsRequest = await fetch(
      `${secrets.firebaseLink}/opinions.json?orderBy="userId"&equalTo="${userId}"`,
      {
        method: 'GET',
        config
      }
    );
    const opinionsRes = await opinionsRequest.json();
    const opinionsId = Object.keys(opinionsRes)[0];
    let likes = [];
    let dislikes = [];
    if(opinionsRes[opinionsId].hasOwnProperty('likes')) {
      likes = opinionsRes[opinionsId].likes
    }
    if(opinionsRes[opinionsId].hasOwnProperty('dislikes')) {
      dislikes = opinionsRes[opinionsId].dislikes
    }

    // Dispatch opinions to reducer
    dispatch({
      type: GET_OPINIONS,
      payload: {
        likes,
        dislikes
      }
    })
  };
};

/**
 * When the user likes a spot, update their likes.
 *
 * @param spotId      The spot ID
 * @param userId      The user's ID
 * @param opinionsId  The ID of their opinions record
 */
export const likingSpotAction = (spotId, userId, opinionsId) => {
  return async (dispatch, getState) => {
    let { likes } = getState().opinions;
    let { dislikes } = getState().opinions;

    // Add the new spot's ID to their likes and then update the database
    likes.push(spotId);
    const likeBody = JSON.stringify({likes, dislikes, userId});
    const likeRequest = await fetch(
      `${secrets.firebaseLink}/opinions/${opinionsId}.json`,
      {
        method: 'PUT',
        config,
        body: likeBody
      }
    );

    // Dispatch likes to reducer
    dispatch({
      type: LIKING_SPOT,
      payload: {
        likes,
        dislikes
      }
    })
  };
};

/**
 * When a user unlikes a spot, update their likes.
 *
 * @param spotId      The spot ID
 * @param userId      The user's ID
 * @param opinionsId  The ID of their opinions record
 */
export const unlikingSpotAction = (spotId, userId, opinionsId) => {
  return async (dispatch, getState) => {
    let { likes } = getState().opinions;
    let { dislikes } = getState().opinions;

    // Get rid of the spot's ID from their likes and update the database
    const newLikes = likes.filter(id => id !== spotId);
    const unlikeBody = JSON.stringify({likes: newLikes, dislikes, userId});
    
    const unlikeRequest = await fetch(
      `${secrets.firebaseLink}/opinions/${opinionsId}.json`,
      {
        method: 'PUT',
        config,
        body: unlikeBody
      }
    );

    // Dispatch likes to reducer
    dispatch({
      type: UNLIKING_SPOT,
      payload: {
        likes: newLikes,
        dislikes
      }
    })
  };
};

/**
 * When a user dislikes a spot, update their dislikes.
 *
 * @param spotId The spot ID
 */
export const dislikingSpotAction = (spotId) => {
  return async (dispatch, getState) => {
    let { likes } = getState().opinions;
    let { dislikes } = getState().opinions;

    dislikes.push(spotId);
    const dislikeBody = JSON.stringify({likes, dislikes, userId});
    const dislikeRequest = await fetch(
      `${secrets.firebaseLink}/destinations/${userId}.json`,
      {
        method: 'PUT',
        config,
        body: dislikeBody
      }
    );

    dispatch({
      type: DISLIKING_SPOT,
      payload: {
        likes,
        dislikes
      }
    })
  };
};

/**
 * When a user undislikes a spot, update their dislikes.
 *
 * @param spotId The spot ID
 */
export const undislikingSpotAction = (spotId) => {
  return async dispatch => {
    let { likes } = getState().opinions;
    let { dislikes } = getState().opinions;

    const newDislikes = likes.filter(id => id !== spotId);
    const undislikeBody = JSON.stringify({likes: newDislikes, dislikes, userId});

    const undislikeRequest = await fetch(
      `${secrets.firebaseLink}/destinations/${userId}.json`,
      {
        method: 'PUT',
        config,
        body: undislikeBody
      }
    );

    dispatch({
      type: UNDISLIKING_SPOT,
      payload: {
        likes,
        dislikes
      }
    })
  };
};
