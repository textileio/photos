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
import TextileImage from '../../TextileImage'
import { UploadingImage } from '../Redux/UploadingImagesRedux'

// Styles
import styles, {PRODUCT_ITEM_HEIGHT, PRODUCT_ITEM_MARGIN, numColumns} from './Styles/PhotoGridStyles'
import { uploadArchive } from '../Sagas/ImageSharingSagas'

export default class PhotoGrid extends React.PureComponent {
  /* ***********************************************************
  * `renderRow` function. How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={item.title} description={item.description} />
  *************************************************************/
  renderRow (row) {
    // TODO: not longer meaningful in the Wallet. Progress data isn't there. Good when we add sync back
    const uploadingImage: UploadingImage | undefined = this.props.progressData[row.item.id]
    let overlay
    if (uploadingImage && this.props.verboseUi) {
      console.log('found', uploadingImage)
      if (uploadingImage.state === 'pending') {
        overlay = <Progress.Pie indeterminate size={20} color={Colors.brandPink} />
      } else if (uploadingImage.state === 'uploading') {
        overlay = <Progress.Pie progress={uploadingImage.uploadProgress} size={20} color={Colors.brandPink} />
      } else if (uploadingImage.state === 'error') {
        const displayError = () => {
          this.refs.toast.show(uploadingImage.errorMessage, 2000)
        }
        overlay = <TouchableOpacity onPress={displayError}>
          <Icon name='exclamation' size={30} color={Colors.brandRed} style={{backgroundColor: Colors.clear}} />
        </TouchableOpacity>
      }
    }
    return (
      <TouchableOpacity style={styles.item} onPress={this.props.onSelect(row)} >
        <View style={styles.itemBackgroundContainer}>
          <TextileImage
            imageId={row.item.id}
            path={'small'}
            style={styles.itemImage}
            resizeMode={'cover'}
          />
        </View>
        <View style={styles.itemOverlay}>
          {overlay}
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
  keyExtractor = (item, index) => item.id

  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 20

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
        {
          this.props.photos.length ? (
            <FlatList
              style={styles.listContainer}
              data={this.props.photos}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderRow.bind(this)}
              getItemLayout={this._getItemLayout}
              numColumns={numColumns}
              windowSize={this.oneScreensWorth}
              initialNumToRender={this.oneScreensWorth}
              onEndReachedThreshold={0.55}
              onRefresh={this.props.onRefresh}
              refreshing={this.props.refreshing}
            />
          ) : (
            <View style={styles.emptyListStyle}>
              <Text style={styles.noPhotos}>{this.props.placeholderText}</Text>
            </View>
          )
        }
        <Toast ref='toast' position='center' />
      </View>
    )
  }
}
