import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Upload</Text>
      </View>
    );
  }
}

export default Upload;
