import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator
} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import {
  getDestinationsAction, opinionAction, postCommentAction, removeDestinationAction,
  saveDestinationAction
} from "../../redux/actions/spotsActions";
import {getOpinionsAction, likingSpotAction, unlikingSpotAction} from "../../redux/actions/opinionsActions";
import MapView, {Marker} from 'react-native-maps';

/**
 * Contains all of the information for a spot.
 */
const SpotScreen = props => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.user.localId);
  const destinationsId = useSelector(state => state.user.user.destinationsId);
  const opinionsId = useSelector(state => state.user.user.opinionsId);
  const likedSpots = useSelector(state => state.opinions.likes);
  const spotId = props.navigation.getParam('spotId');
  let isSubmitter;

  // Fields that tell what section the user is currently viewing
  const [viewingInfo, changeViewingInfo] = useState(true);
  const [viewingMap, changeViewingMap] = useState(false);
  const [viewingComments, changeViewingComments] = useState(false);

  // Get the spot information using its ID
  const spot = useSelector(state => {
    const spots = state.spots.spots;
    return spots.find((s) => spotId === s.id);
  });
  if (spot.userId === userId) {
    isSubmitter = true;
  }
  const spotLikes = JSON.parse(JSON.stringify(spot.likes));
  const [numLikes, changeLikes] = useState(spotLikes);
  const [liked, changeLiked] = useState(false);
  const [spotComments, changeComments] = useState(spot.comments);
  const [commentInfo, changeComment] = useState('');
  const [postingComment, changePostingComment] = useState(false);

  // Destinations configuration
  const saveText = 'Save This Spot';
  const removeText = 'Remove Spot';
  const saveColor = '#4C96F2';
  const removeColor = '#C9302D';
  let destinationChoiceText = '';
  let destinationChoiceColor = 'white';

  // Deciding the color and text of the "Destinations" button depending if it was already saved or not
  let savedDestination = useSelector(state => {
    const destinations = state.spots.destinations;
    if (destinations.length === 0) {
      destinationChoiceText = saveText;
      destinationChoiceColor = saveColor;
      return false;
    }
    if (destinations.find((s) => spotId === s.id) !== -1) {
      destinationChoiceText = removeText;
      destinationChoiceColor = removeColor;
      return true;
    }
  });

  // Get the user's destinations on page load
  useEffect( () => {
    async function getDestinations() {
      dispatch(getDestinationsAction(userId));
    }
    getDestinations().then();

    async function getLikes() {
      await dispatch(getOpinionsAction(userId));
    }
    getLikes().then(next => {
      if ((likedSpots.indexOf(spotId) !== -1)) {
        changeLiked(true);
      }
    });
  }, []);

  // Switches to info view
  const switchToInfo = useCallback(() => {
    changeViewingInfo(true);
    changeViewingMap(false);
    changeViewingComments(false);
  }, []);

  // Switches to map view
  const switchToMap = useCallback(() => {
    changeViewingInfo(false);
    changeViewingMap(true);
    changeViewingComments(false);
  }, []);

  // Switches to comments view
  const switchToComments = useCallback(() => {
    changeViewingInfo(false);
    changeViewingMap(false);
    changeViewingComments(true);
  }, []);

  // Saves the current spot as a destination
  const saveAsDestination = useCallback(async () => {
    try {
      await dispatch(saveDestinationAction(userId, spot, destinationsId));
      savedDestination = true;
      destinationChoiceText = removeText;
      destinationChoiceColor = removeColor;
    } catch (error) {

    }
  }, []);

  // Removes the current spot as a destination
  const removeDestination = useCallback(async () => {
    try {
      await dispatch(removeDestinationAction(userId, spot, destinationsId));
      savedDestination = false;
      destinationChoiceText = saveText;
      destinationChoiceColor = saveColor;
    } catch (error) {

    }
  }, []);

  // Post a new comment
  const postComment = useCallback(async () => {
    try {
      changePostingComment(true);
      const newComment = [commentInfo];
      const newComments = newComment.concat(spotComments);
      await dispatch(postCommentAction(spot, newComments));
      changeComments(newComments);
      changePostingComment(false);
      changeComment('');
    } catch (error) {

    }
  }, [commentInfo]);

  // Function for handling likes
  const likePost = async () => {
    try {
      if (liked) {
        // If already liked, remove the like
        await dispatch(opinionAction(spot, 'REMOVE_LIKE'));
        await dispatch(unlikingSpotAction(spotId, userId, opinionsId));

        changeLikes(numLikes - 1);
        changeLiked(false);
      } else {
        // If not liked, add a like
        await dispatch(opinionAction(spot, 'LIKE_SPOT'));
        await dispatch(likingSpotAction(spotId, userId, opinionsId));

        changeLikes(numLikes + 1);
        changeLiked(true);
      }
    } catch (error) {

    }
  };

  return (
    <ScrollView>
      <View style={styles.spotView}>
        <View style={styles.imageView}>
          <Image
            style={styles.spotImage}
            source={{ uri: spot.image }}
          />
        </View>
        <View>
          <View style={styles.spotLocationView}>
            <Text>
              {spot.area}, {spot.country}
            </Text>
          </View>

          <View style={styles.segmentWrapper}>
            <View style={styles.segmentElementsWrapper}>
              <View style={styles.segmentElementView}>
                <TouchableHighlight
                  style={viewingInfo ? styles.activeElement : styles.inactiveElement}
                  onPress={() => {switchToInfo()}}
                  underlayColor='#4C96F2'
                >
                  <View >
                    <Text>Info</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={styles.segmentElementView}>
                <TouchableHighlight
                  style={viewingMap ? styles.activeElement : styles.inactiveElement}
                  onPress={() => {switchToMap()}}
                  underlayColor='#4C96F2'
                >
                  <View>
                    <Text>Map</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={styles.segmentElementView}>
                <TouchableHighlight
                  style={viewingComments ? styles.activeElement : styles.inactiveElement}
                  onPress={() => {switchToComments()}}
                  underlayColor='#4C96F2'
                >
                  <View>
                    <Text>Comments</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          {viewingInfo &&
            <View style={styles.infoView}>
              <View style={styles.topSection}>
                <View>
                  <Text style={styles.nameText}>
                    {spot.name}
                  </Text>
                  <View style={styles.locationView}>
                    <Icon name="md-pin" size={20} />
                    <Text style={styles.locationText}>
                      {spot.address}
                    </Text>
                  </View>
                </View>
                <View style={styles.opinionsView}>
                  <View>
                    <View style={{alignItems: 'center'}}>
                      <Text style={{fontSize: 20}}>{numLikes}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {likePost()}}
                    >
                      {liked &&
                        <Icon name="md-heart" size={32}/>
                      }
                      {!liked &&
                        <Icon name="md-heart-empty" size={32}/>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.descriptionView}>
                <Text>
                  {spot.information}
                </Text>
              </View>
              <View style={styles.destinationView}>
                <View style={styles.destinationOptionsView}>
                  {isSubmitter &&
                  <Button
                    title='This Is Your Spot!'
                    disabled={isSubmitter}
                    onPress={() => {}}
                  />
                  }
                  {!isSubmitter &&
                  <Button
                    title={destinationChoiceText}
                    color={destinationChoiceColor}
                    onPress={() => {
                      if(!savedDestination) {
                        saveAsDestination();
                      }else {
                        removeDestination();
                      }
                    }}
                  />
                  }
                </View>
              </View>
            </View>
          }
          {viewingMap &&
            <View style={styles.mapView}>
              {!spot.latitude && !spot.longitude &&
                <Text style={styles.mapHeaderText}>No Coordinates Given</Text>
              }

              {spot.latitude && spot.longitude &&
                <View style={styles.mapSectionView}>
                  <Text style={styles.mapHeaderText}>Map Location</Text>
                  <View style={styles.mapDisplayView}>
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: spot.latitude,
                        longitude: spot.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                    >
                    <MapView.Marker coordinate={{latitude: spot.latitude, longitude: spot.longitude}} />
                    </MapView>
                  </View>
                </View>
              }
            </View>
          }
          {viewingComments &&
            <View style={styles.commentSectionWrapper}>
              <View style={styles.postCommentView}>
                <Text style={styles.postCommentText}>Post A Comment</Text>
                <TextInput
                  style={styles.postInput}
                  numberOfLines={2}
                  value={commentInfo}
                  onChangeText={input => changeComment(input)}
                />

                {!postingComment &&
                <Button
                  title='Post comment'
                  disabled={commentInfo === ''}
                  onPress={() => {
                    postComment();
                  }}
                />
                }

                {postingComment &&
                <View>
                  <ActivityIndicator size="large"/>
                </View>
                }
              </View>
              <View style={styles.commentsView}>
                <Text style={styles.commentsText}>Comments</Text>
                <FlatList
                  data={spotComments}
                  extraData={spotComments}
                  renderItem = {
                    item => (
                      <View style={styles.commentView}>
                        <Text style={styles.posterText}>Anonymous</Text>
                        <Text style={styles.commentText}>
                          {item.item}
                        </Text>
                      </View>
                    )
                  }
                />
              </View>
            </View>
          }
        </View>
      </View>
    </ScrollView>
  )
};

// Styling
const styles = StyleSheet.create({
  spotView: {

  },
  imageView: {
    height: 200,
    width: '100%'
  },
  spotImage: {
    width: '100%',
    height: '100%'
  },
  spotLocationView: {
    alignItems: 'center'
  },
  segmentWrapper: {
    alignItems: 'center',
    marginTop: 10
  },
  segmentElementsWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#4C96F2',
    borderWidth: 2,
    borderRadius: 3
  },
  inactiveElement: {
    backgroundColor: 'white',
    paddingVertical: 3,
    width: '100%',
    alignItems: 'center'
  },
  activeElement: {
    backgroundColor: '#4C96F2',
    paddingVertical: 3,
    width: '100%',
    alignItems: 'center'
  },
  segmentElementView: {
    width: '25%'
  },
  infoView: {
    marginTop: 20,
    marginHorizontal: 20
  },
  topSection: {
    flexDirection: 'row'
  },
  opinionsView: {
    marginHorizontal: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  nameText: {
    fontSize: 24
  },
  descriptionView: {
    marginTop: 30,
    height: 150
  },
  locationView: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 10
  },
  locationText: {
    fontSize: 16,
    marginLeft: 5
  },
  destinationView: {
    alignItems: 'center'
  },
  destinationOptionsView: {
    marginTop: 20,
    width: '80%'
  },
  mapView: {
    marginTop: 20,
    alignItems: 'center'
  },
  mapHeaderText: {
    fontSize: 20
  },
  mapSectionView: {
    alignItems: 'center'
  },
  mapDisplayView: {
    marginTop: 20,
    alignItems: 'center'
  },
  map: {
    width: 300,
    height: 250
  },
  commentSectionWrapper: {
    marginTop: 30,
    marginHorizontal: 20
  },
  postCommentView: {

  },
  postCommentText: {
    fontSize: 16
  },
  postInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginVertical: 10
  },
  commentsView: {
    marginTop: 20,
  },
  commentsText: {
    fontSize: 18
  },
  commentView: {
    marginVertical: 10
  },
  posterText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  commentText: {
    fontSize: 14
  }
});

// Navigation
SpotScreen.navigationOptions = navigationInfo => {
  return {
    headerTitleStyle: { alignSelf: 'center' },
    headerTitle: navigationInfo.navigation.getParam('spotName')
  }
};

export default SpotScreen;
