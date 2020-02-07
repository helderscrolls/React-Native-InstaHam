import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';

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
});

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedin: false,
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

  render() {
    const { isLoggedin } = this.state;
    return (
      <View style={styles.loadingContainer}>
        {isLoggedin === true ? (
          // are logged in
          <Text>Comments</Text>
        ) : (
          // not logged in
          <View>
            <Text>You are not logged in</Text>
            <Text>Please login to post a comment</Text>
          </View>
        )}
      </View>
    );
  }
}

export default Comments;
