import React, { Component } from 'react';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import { f, auth, database, storage } from '../../config/config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 28,
    paddingBottom: 15,
  },
  uploadButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedin: false,
      imageId: this.uniqueId(),
    };
  }

  componentDidMount() {
    const that = this;

    f.auth().onAuthStateChanged(function(user) {
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

  checkPermissions = async () => {
    const { status } = await await Permissions.askAsync(Permissions.CAMER);
    this.setState({ camera: status });

    const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ cameraRoll: statusRoll });
  };

  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  uniqueId = () => {
    return (
      this.s4() +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4()
    );
  };

  findNewImage = async () => {
    this.checkPermissions();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      console.log('upload image');
      this.uploadImage(result.uri);
    } else {
      console.log('cancel');
    }
  };

  uploadImage = async uri => {
    const that = this;
    const userId = f.auth().currentUser.uid;
    const imageId = this.state.imageId;

    const extensionExtractor = /(?:\.([^,]+))?$/;
    const fileExtension = extensionExtractor.exec(uri)[1];
    this.setState({ currentFileType: fileExtension });

    const response = await fetch(uri);
    const blob = await response.blob();
    const FilePath = imageId + '.' + that.state.currentFileType;

    const ref = storage.ref('user/' + userId + '/img').child(FilePath);

    const snapshot = ref.put(blob).on('state_changed', snapshot => {
      console.log('Progress', snapshot.bytesTransferred, snapshot.totalBytes);
    });
  };

  render() {
    const { isLoggedin } = this.state;
    return (
      <View style={styles.loadingContainer}>
        {isLoggedin === true ? (
          // are logged in
          <View style={styles.uploadContainer}>
            <Text style={styles.uploadTitle}>Upload</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => this.findNewImage()}
            >
              <Text style={styles.uploadButtonText}>Select Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // not logged in
          <View style={styles.loginContainer}>
            <Text>You are not logged in</Text>
            <Text>Please login to upload a photo</Text>
          </View>
        )}
      </View>
    );
  }
}

export default Upload;
