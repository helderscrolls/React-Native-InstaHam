import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';

const styles = StyleSheet.create({
  container: {
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
  feedList: {
    flex: 1,
    backgroundColor: '#eee',
  },
  feedItems: {
    width: '100%',
    overflow: 'hidden',
    marginBottom: 5,
    justifyContent: 'space-between',
    borderColor: 'grey',
    borderBottomWidth: 1,
  },
  feedItemsTopText: {
    padding: 5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedImages: {
    resizeMode: 'cover',
    width: '100%',
    height: 275,
  },
  feedCaptions: {
    padding: 5,
  },
  feedComments: {
    marginTop: 10,
    textAlign: 'center',
  },
});

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoFeed: [0, 1, 2, 3, 4],
      refresh: false,
    };
  }

  loadNew = () => {
    this.setState({
      refresh: true,
    });

    this.setState({
      photoFeed: [5, 6, 7, 8, 9],
      refresh: false,
    });
  };

  render() {
    const { refresh } = this.state;
    const { photoFeed } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text>Feed</Text>
        </View>

        <FlatList
          style={styles.feedList}
          refreshing={refresh}
          onRefresh={this.loadNew}
          data={photoFeed}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.feedItems} key={index}>
              <View style={styles.feedItemsTopText}>
                <Text>Time Ago</Text>
                <Text>@HelderScrolls</Text>
              </View>

              <View>
                <Image
                  source={{
                    uri:
                      'https://source.unsplash.com/random/500x' +
                      Math.floor(Math.random() * 800 + 500),
                  }}
                  style={styles.feedImages}
                />
              </View>

              <View style={styles.feedCaptions}>
                <Text>Caption text here...</Text>
                <Text style={styles.feedComments}>View Comments</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

export default Feed;
