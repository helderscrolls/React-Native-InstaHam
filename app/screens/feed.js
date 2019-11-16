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
      photoFeed: [],
      refresh: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.loadFeed();
  }

  pluralCheck = s => {
    if (s === 1) {
      return ' ago';
    }
    return 's go';
  };

  timeConverter = timestamp => {
    const a = new Date(timestamp * 1000);
    const seconds = Math.floor((new Date() - a) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + ' year' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' month' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' day' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' hour' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + ' minute' + this.pluralCheck(interval);
    }
    return Math.floor(seconds) + ' second' + this.pluralCheck(seconds);
  };

  loadFeed = () => {
    this.setState({
      refresh: true,
      photoFeed: [],
    });

    const that = this;

    database
      .ref('photos')
      .orderByChild('posted')
      .once('value')
      .then(snapshot => {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        let photoFeed = that.state.photoFeed;

        for (let photo in data) {
          let photoObj = data[photo];
          database
            .ref('users')
            .child(photoObj.author)
            .child('username')
            .once('value')
            .then(snapshot => {
              const exists = snapshot.val() !== null;
              if (exists) data = snapshot.val();
              photoFeed.push({
                id: photo,
                url: photoObj.url,
                caption: photoObj.caption,
                posted: that.timeConverter(photoObj.posted),
                author: data,
              });

              that.setState({
                refresh: false,
                isLoading: false,
              });
            })
            .catch(error => console.log(error));
        }
      })
      .catch(error => console.log(error));
  };

  loadNew = () => {
    this.loadFeed();
  };

  render() {
    const { refresh } = this.state;
    const { photoFeed } = this.state;
    const { isLoading } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text>Feed</Text>
        </View>
        {isLoading === true ? (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        ) : (
          <FlatList
            style={styles.feedList}
            refreshing={refresh}
            onRefresh={this.loadNew}
            data={photoFeed}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.feedItems} key={index}>
                <View style={styles.feedItemsTopText}>
                  <Text> {item.posted} </Text>
                  <Text> {item.author} </Text>
                </View>

                <View>
                  <Image source={{ uri: item.url }} style={styles.feedImages} />
                </View>

                <View style={styles.feedCaptions}>
                  <Text> {item.caption} </Text>
                  <Text style={styles.feedComments}>View Comments</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    );
  }
}

export default Feed;
