// @flow
import React from 'react'
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import * as Progress from 'react-native-progress'
import Toast from 'react-native-easy-toast'
import { Colors } from '../Themes'

// Styles
import styles, {PRODUCT_ITEM_HEIGHT, PRODUCT_ITEM_MARGIN, numColumns} from './Styles/PhotoGridStyles'

export default class PhotoGrid extends React.PureComponent {
  /* ***********************************************************
  * `renderRow` function. How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={item.title} description={item.description} />
  *************************************************************/
  renderRow (row) {
    const {item} = row
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
        <Icon name='exclamation' size={30} color={Colors.brandRed} style={{backgroundColor: Colors.clear}} />
      </TouchableOpacity>
    }
    return (
      <TouchableOpacity onPress={this.props.onSelect(row)} >
        <View style={styles.item}>
          <View style={styles.itemBackgroundContainer}>
            <Image
              source={{uri: 'https://localhost:9080/ipfs/' + item.hash + '/thumb'}}
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
            this.props.items.length ? (
              <FlatList
                style={styles.listContainer}
                data={this.props.items}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderRow.bind(this)}
                getItemLayout={this._getItemLayout}
                numColumns={numColumns}
                initialNumToRender={this.oneScreensWorth}
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
