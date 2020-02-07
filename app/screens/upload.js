import React, { Component } from 'react';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableOpacityBase,
  ActivityIndicatorBase,
} from 'react-native';

import { f, auth, database, storage } from '../../config/config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  imageSelectedContainer: {
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
  captionContainer: {
    padding: 5,
  },
  captionLabel: {
    marginTop: 5,
  },
  captionInput: {
    marginVertical: 10,
    height: 100,
    padding: 5,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: 'white',
    color: 'black',
  },
  submitButton: {
    alignSelf: 'center',
    width: 170,
    marginHorizontal: 'auto',
    backgroundColor: 'purple',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    textAlign: 'center',
    color: 'white',
  },
  uploadingPreviewContainer: {
    marginTop: 10,
  },
  uploadingPreviewImage: {
    marginTop: 10,
    resizeMode: 'cover',
    width: '100%',
    height: 275,
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
      imageSelected: false,
      isUploading: false,
      caption: '',
      progress: 0,
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
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
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
      this.setState({
        imageSelected: true,
        imageId: this.uniqueId(),
        uri: result.uri,
      });
      //this.uploadImage(result.uri);
    } else {
      console.log('cancel');
      this.setState({
        imageSelected: false,
      });
    }
  };

  uploadPublish = () => {
    Keyboard.dismiss();
    const { caption, uri } = this.state;

    if (caption !== '') {
      this.uploadImage(uri);
    } else {
      alert('Please enter a caption..');
    }
  };

  uploadImage = async uri => {
    const that = this;
    const userId = f.auth().currentUser.uid;
    const imageId = this.state.imageId;

    const extensionExtractor = /(?:\.([^,]+))?$/;
    const fileExtension = extensionExtractor.exec(uri)[1];
    this.setState({
      currentFileType: fileExtension,
      isUploading: true,
    });

    const response = await fetch(uri);
    const blob = await response.blob();
    const FilePath = imageId + '.' + that.state.currentFileType;

    const uploadTask = storage
      .ref('user/' + userId + '/img')
      .child(FilePath)
      .put(blob);

    uploadTask.on(
      'state_changed',
      function(snapshot) {
        const progress = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        console.log('Upload is ' + progress + '% complete');
        that.setState({
          progress: progress,
        });
      },
      function(error) {
        console.log('error with upload -' + error);
      },
      function() {
        that.setState({
          progress: 100,
        });
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log(downloadURL);

          alert(downloadURL);
        });
      },
    );

    // const snapshot = ref.put(blob).on('state_changed', snapshot => {
    //   console.log('Progress', snapshot.bytesTransferred, snapshot.totalBytes);
    // });
  };

  render() {
    const {
      isLoggedin,
      imageSelected,
      progress,
      isUploading,
      uri,
    } = this.state;

    return (
      <View style={styles.loadingContainer}>
        {isLoggedin === true ? (
          // are logged in
          <View style={styles.mainContainer}>
            {imageSelected === true ? (
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.imageSelectedContainer}>
                  <View style={styles.titleContainer}>
                    <Text>Upload</Text>
                  </View>
                  <View style={styles.captionContainer}>
                    <Text style={styles.captionLabel}>Caption:</Text>
                    <TextInput
                      style={styles.captionInput}
                      editable={true}
                      placeholder={'Enter your caption...'}
                      maxLength={150}
                      multiline={true}
                      numberOfLines={4}
                      onChangeText={text => this.setState({ caption: text })}
                    />

                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => this.uploadPublish()}
                    >
                      <Text style={styles.submitButtonText}>
                        Upload & Publish
                      </Text>
                    </TouchableOpacity>

                    {isUploading === true ? (
                      <View style={styles.uploadingPreviewContainer}>
                        <Text>{progress}%</Text>
                        {progress !== 100 ? (
                          <ActivityIndicator size="small" color="blue" />
                        ) : (
                          <Text>Processing</Text>
                        )}
                      </View>
                    ) : (
                      <View></View>
                    )}

                    <Image
                      style={styles.uploadingPreviewImage}
                      source={{ uri: uri }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <View style={styles.uploadContainer}>
                <Text style={styles.uploadTitle}>Upload</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => this.findNewImage()}
                >
                  <Text style={styles.uploadButtonText}>Select Photo</Text>
                </TouchableOpacity>
              </View>
            )}
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
