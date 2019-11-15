import React, { Component } from 'react';
import {
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Facebook from 'expo-facebook';

import { f, auth, database, storage } from './config/config.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };

    // this.registerUser('test2@gmail.com', 'fakepassword');

    const that = this;
    f.auth().onAuthStateChanged(function(user) {
      if (user) {
        // Logged in
        that.setState({
          loggedIn: true,
        });
        console.log('Logged in', user);
      } else {
        // Logged out
        that.setState({
          loggedIn: false,
        });
        console.log('Logged out');
      }
    });
  }

  loginUser = async (email, password) => {
    if (email !== '' && password !== '') {
      //
      try {
        let user = await auth.signInWithEmailAndPassword(email, password);
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    } else {
      // If they are empty
      alert('Missing email or password');
    }
  };

  registerUser = (email, password) => {
    console.log(email, password);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userObj => console.log(email, password, userObj))
      .catch(error => console.log('error logging in', error));
  };

  signUserOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log('Logged out...');
      })
      .catch(error => {
        console.log('Error:', error);
      });
  };

  async loginWithFacebook() {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      '559161524909541',
      {
        permissions: ['email', 'public_profile'],
      },
    );

    if (type === 'success') {
      const credentials = f.auth.FacebookAuthProvider.credential(token);
      f.auth()
        .signInWithCredential(credentials)
        .catch(error => {
          console.log('Error...', error);
        });
    }
  }

  render() {
    const { loggedIn } = this.state;
    const { emailLoginView } = this.state;
    const { email } = this.state;
    const { password } = this.state;

    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>--------</Text>
        {loggedIn === true ? (
          <View>
            <TouchableHighlight
              onPress={() => this.signUserOut()}
              style={{ backgroundColor: 'red' }}
            >
              <Text>Log Out</Text>
            </TouchableHighlight>
            <Text>Logged in...</Text>
          </View>
        ) : (
          <View>
            {emailLoginView === true ? (
              <View>
                <Text>Email:</Text>
                <TextInput
                  onChangeText={text => this.setState({ email: text })}
                  value={email}
                />

                <Text>Password:</Text>
                <TextInput
                  onChangeText={text => this.setState({ password: text })}
                  secureTextEntry={true}
                  value={password}
                />

                <TouchableHighlight
                  onPress={() => this.loginUser(email, password)}
                  style={{ backgroundColor: 'red' }}
                >
                  <Text>Login</Text>
                </TouchableHighlight>
              </View>
            ) : (
              <View />
            )}

            <TouchableHighlight
              style={{ backgroundColor: 'green' }}
              onPress={() => this.setState({ emailLoginView: true })}
            >
              <Text style={{ color: 'white' }}>Login With Email</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ backgroundColor: 'green' }}
              onPress={() => this.loginWithFacebook()}
            >
              <Text style={{ color: 'white' }}>Login With Facebook</Text>
            </TouchableHighlight>
          </View>
        )}
      </View>
    );
  }
}
