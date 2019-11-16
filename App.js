import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { f, auth, database, storage } from './config/config';

import Feed from './app/screens/feed';
import Upload from './app/screens/upload';
import Profile from './app/screens/profile';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const RootStack = createBottomTabNavigator({
  Feed: {
    screen: Feed,
  },
  Upload: {
    screen: Upload,
  },
  Profile: {
    screen: Profile,
  },
});

const MainStack = createAppContainer(RootStack);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.login();
  }

  login = async () => {
    // Force user to login
    try {
      let user = await auth.signInWithEmailAndPassword(
        'toto@toto.com',
        'Azertyu8',
      );
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return <MainStack />;
  }
}
