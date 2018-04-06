// @flow
import React from 'react'
import {View, Text, FlatList, ImageBackground} from 'react-native'
import { connect } from 'react-redux'
import Actions from '../Redux/TextileRedux'
import { Card, Avatar } from 'react-native-elements'

// More info here: https://facebook.github.io/react-native/docs/flatlist.html

// Styles
import styles from './Styles/LogViewStyle'

class LogView extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      limit: 10
    }
  }

  /* ***********************************************************
  * STEP 2
  * `renderRow` function. How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={item.title} description={item.description} />
  *************************************************************/
  renderRow ({item}) {
    let label = ''
    // Figuring we can use the 'status' blocks to inform the user
    // about where their photo is backed up
    if (item.state === 'complete') {
      label = item.hash
    } else if (item.state === 'error') {
      label = item.error
    } else {
      label = item.state
    }

    return (
      <Card containerStyle={styles.cardStyle} >
        <View style={styles.notification}>
          <View style={styles.avatar}>
            <Avatar
              medium
              rounded
              source={{uri: item.image.node.image.thumbPath}}
              activeOpacity={0.7}
            />
          </View>
          <View>
            <Text style={styles.notificationText}>{label}</Text>
          </View>
        </View>
      </Card>
    )
  }
  renderFooter = () => {
    if (this.props.images.items.length != 0) {
      return null
    }

    return (
      <Card
        style={styles.cardStyle}
        image={require('../Images/backgrounds/no-image-yet.png')}>
        <View style={styles.statusCell}>
          <View style={styles.noPhotos}>
            <Text> Waiting for Logs. </Text>
          </View>
        </View>
      </Card>
    );
  };
  // The default function if no Key is provided is index
  // an identifiable key is important if you plan on
  // item reordering.  Otherwise index is fine
  keyExtractor = (item, index) => index

  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 10

  // extraData is for anything that is not indicated in data
  // for instance, if you kept "favorites" in `this.state.favs`
  // pass that in, so changes in favorites will cause a re-render
  // and your renderItem will have access to change depending on state
  // e.g. `extraData`={this.state.favs}

  // Optimize your list if the height of each item can be calculated
  // by supplying a constant height, there is no need to measure each
  // item after it renders.  This can save significant time for lists
  // of a size 100+
  // e.g. itemLayout={(data, index) => (
  //   {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  // )}

  render () {
    return (
      <ImageBackground
        source={require('../Images/backgrounds/log-background.png')}
        style={styles.backgroundImage}>
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={styles.listContent}
            data={this.props.images.items}
            renderItem={this.renderRow.bind(this)}
            numColumns={1}
            keyExtractor={this.keyExtractor}
            initialNumToRender={this.oneScreensWorth}
            onEndReachedThreshold={0.5}
            onEndReached={({ distanceFromEnd }) => {
              // This has an issue
              // It would currently load new ones on first load too
              // const lastItem = this.props.images.items[
              //   this.props.images.items.length - 1
              //   ]
              // this.props.getHashesRequest(lastItem.hash, 10)
            }}
            // ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            // ListFooterComponent={this.renderFooter}
            // ListEmptyComponent={this.renderEmpty}
            // ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
      </ImageBackground>
    )
  }
}

const mapStateToProps = state => {
  return {
    images: {
      items: state.textile && state.textile.images && state.textile.images.items ? state.textile.images.items : []
    }
  }
}

export default connect(mapStateToProps)(LogView)
