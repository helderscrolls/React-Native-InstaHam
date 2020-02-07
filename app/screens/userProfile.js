import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacityBase,
} from 'react-native';
import { f, auth, database, storage } from '../../config/config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
  },
  titleContainer: {
    height: 70,
    paddingTop: 30,
    backgroundColor: 'white',
    borderColor: 'lightgrey',
    borderBottomWidth: 0.5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleContainerItems: {
    width: 100,
  },
  titleContainerButton: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  topSection: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  topSectionText: {
    marginLeft: 10,
  },
  profileAvatar: {
    marginLeft: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  middleSection: {
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  button: {
    marginTop: 10,
    marginHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    borderColor: 'grey',
    borderWidth: 1.5,
  },
  uploadButton: {
    marginTop: 10,
    marginHorizontal: 40,
    paddingVertical: 35,
    borderRadius: 20,
    borderColor: 'grey',
    borderWidth: 1.5,
    backgroundColor: 'grey',
  },
  buttonText: {
    textAlign: 'center',
    color: 'grey',
  },
  uploadButtonText: {
    textAlign: 'center',
    color: 'white',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
});

class userProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount() {
    this.checkParams();
  }

  checkParams = () => {
    const params = this.props.navigation.state.params;

    if (params) {
      if (params.userId) {
        this.setState({
          userId: params.userId,
        });
        this.fetchUserInfo(params.userId);
      }
    }
  };

  fetchUserInfo = userId => {
    const that = this;

    database
      .ref('users')
      .child(userId)
      .child('username')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        that.setState({ username: data });
      })
      .catch(error => console.log(error));

    database
      .ref('users')
      .child(userId)
      .child('name')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        that.setState({ name: data });
      })
      .catch(error => console.log(error));

    database
      .ref('users')
      .child(userId)
      .child('avatar')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        that.setState({ avatar: data, isLoaded: true });
      })
      .catch(error => console.log(error));
  };

  render() {
    const { isLoaded, name, username, avatar } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        {isLoaded === false ? (
          <View>
            <Text>Loading...</Text>
          </View>
        ) : (
          <View style={styles.profileContainer}>
            <View style={styles.titleContainer}>
              <TouchableOpacity
                style={styles.titleContainerItems}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.titleContainerButton}>Go Back</Text>
              </TouchableOpacity>
              <Text>Profile</Text>
              <Text style={styles.titleContainerItems} />
            </View>

            <View style={styles.topSection}>
              <Image style={styles.profileAvatar} source={{ uri: avatar }} />
              <View style={styles.topSectionText}>
                <Text>{name}</Text>
                <Text>{username}</Text>
              </View>
            </View>

            <View style={styles.bottomSection}>
              <Text>Loading photos...</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

userProfile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default userProfile;
