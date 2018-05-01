// @flow
import React from 'react'
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native'
import Evilicon from 'react-native-vector-icons/EvilIcons'
import { connect } from 'react-redux'
import * as Progress from 'react-native-progress'
import Toast from 'react-native-easy-toast'
import { Colors } from '../Themes'
import IPFS from '../../TextileIPFSNativeModule'

// Styles
import styles, {PRODUCT_ITEM_HEIGHT, PRODUCT_ITEM_MARGIN, numColumns} from './Styles/TextilePhotosStyle'

class TextilePhotos extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: (
        <Image source={require('../Images/TextileHeader.png')} />
      )
    }
  }

  /* ***********************************************************
  * `renderRow` function. How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={item.title} description={item.description} />
  *************************************************************/
  renderRow (row) {
    const {item} = row
    const onPress = this.onPressIt(row)
    let overlay
    if (item.state === 'pending') {
      overlay = <Progress.Pie indeterminate size={20} color={Colors.brandPink} />
    } else if (item.state === 'processing') {
      overlay = <Progress.Pie progress={item.progress} size={20} color={Colors.brandPink} />
    } else if (item.state === 'error') {
      const displayError = () => {
        this.refs.toast.show(item.error, 2000)
      }
      overlay = <TouchableOpacity onPress={displayError}>
        <Evilicon name='exclamation' size={30} color={Colors.brandRed} style={{backgroundColor: Colors.clear}} />
      </TouchableOpacity>
    }
    const imageData = IPFS.syncGetPhotoData(item.image.hash + '/thumb')
    return (
      <TouchableOpacity onPress={onPress} >
        <View style={styles.item}>
          <View style={styles.itemBackgroundContainer}>
            <Image
              source={{uri: 'data:image/jpeg;base64,' + imageData}}
              resizeMode={'cover'}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemOverlay}>
            {overlay}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  onPressIt = (row) => {
    return () => {
      this.props.navigation.navigate('PhotoViewer', row)
    }
  }

  _getItemLayout = (data, index) => {
    const productHeight = PRODUCT_ITEM_HEIGHT + PRODUCT_ITEM_MARGIN
    return {
      length: productHeight,
      offset: productHeight * index,
      index
    }
  }

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
      <View style={styles.container}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.2
          }}
        >
          <Image style={{
            flex: 1,
            resizeMode: 'center',
            position: 'absolute',
            bottom: 0
          }} source={require('../Images/backgrounds/TextileBackground.png')} />
        </View>
        {
          this.props.renderImages ? (
            this.props.images.items.length ? (
              <FlatList
                style={styles.listContainer}
                data={this.props.images.items}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderRow.bind(this)}
                getItemLayout={this._getItemLayout}
                numColumns={numColumns}
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
              />
            ) : (
              <View style={styles.emptyListStyle}>
                <Text style={styles.noPhotos}>Any new photos you take will be displayed here and synced to Textile.</Text>
              </View>
            )
          ) : (
            <View style={styles.emptyListStyle}>
              <Text style={styles.noPhotos}>Loading...</Text>
            </View>
          )
        }
        <Toast ref='toast' position='center' />
      </View>
    )
  }
}

const mapStateToProps = state => {
  let allItemsObj = state.ipfs.photos.hashes.reduce((o, hash, index) => ({...o, [hash]: { index, image: { hash }, state: 'complete' }}), {})
  for (const processingItem of state.textile.images.items) {
    const item = allItemsObj[processingItem.image.hash]
    if (item) {
      const updatedItem = item.merge(processingItem)
      allItemsObj = allItemsObj.set(processingItem.image.hash, updatedItem)
    }
  }
  const updatedItems = Object.values(allItemsObj).sort((a, b) => a.index > b.index)
  return {
    images: {
      items: updatedItems
    },
    renderImages: state.ipfs.nodeState.state === 'started' && !state.ipfs.photos.querying
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
