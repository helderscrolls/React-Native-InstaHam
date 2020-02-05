import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
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
    justifyContent: 'center',
    alignItems: 'center',
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

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedin: false,
    };
  }

  componentDidMount() {
    const that = this;

    f.auth().onAuthStateChanged(user => {
      if (user) {
        // Logged in
        that.setState({
          isLoggedin: true,
        });
      } else {
        // Not logged in
        that.setState({
          isLoggedin: false,
        });
      }
    });
  }

  render() {
    const { isLoggedin } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        {isLoggedin === true ? (
          // are logged in
          <View style={styles.profileContainer}>
            <View style={styles.titleContainer}>
              <Text>Profile</Text>
            </View>

            <View style={styles.topSection}>
              <Image
                style={styles.profileAvatar}
                source={{
                  uri: 'https://api.adorable.io/avatars/285/test@user.i.png',
                }}
              />
              <View style={styles.topSectionText}>
                <Text>Name</Text>
                <Text>@Username</Text>
              </View>
            </View>

            <View style={styles.middleSection}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Upload')}
                style={styles.uploadButton}
              >
                <Text style={styles.uploadButtonText}>Upload New +</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSection}>
              <Text>Loading photos...</Text>
            </View>
          </View>
        ) : (
          // not logged in
          <View style={styles.loadingContainer}>
            <Text>You are not logged in</Text>
            <Text>Please login to view your profile</Text>
          </View>
        )}
      </View>
    );
  }
}

Profile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default Profile;
