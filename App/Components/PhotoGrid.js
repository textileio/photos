import React from 'react'
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import * as Progress from 'react-native-progress'
import Toast from 'react-native-easy-toast'
import { Colors } from '../Themes'
import TextileImage from '../../TextileImage'
import { UploadingImage } from '../Redux/UploadingImagesRedux'

// Styles
import styles from './Styles/PhotoGridStyles'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default class PhotoGrid extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = this.getLayout(props)
  }

  getLayout () {
    const screenWidth = WIDTH < HEIGHT ? WIDTH : HEIGHT
    const isSmallDevice = screenWidth <= 414
    const numColumns = this.props.gridView ? isSmallDevice ? 3 : 4 : 1
    const itemOffset = 3
    const itemMargin = itemOffset * 2
    const itemWidth = (screenWidth - itemMargin) / numColumns - itemMargin
    return {
      flatListKey: this.props.gridView ? 0 : 1,
      screenWidth,
      isSmallDevice,
      numColumns,
      itemOffset,
      itemMargin,
      itemWidth,
      itemHeight: itemWidth
    }
  }

  componentDidUpdate (prevProps, prevState, ss) {
    if (
      this.props.gridView !== prevProps.gridView
    ) {
      this.setState(this.getLayout())
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
    const uploadingImage: UploadingImage | undefined = this.props.progressData[row.item.photo.id]
    let overlay
    if (uploadingImage && this.props.verboseUi) {
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
    const height = this.state.itemWidth * row.item.metadata.height / row.item.metadata.width
    const width = this.state.itemWidth
    return (
      <TouchableOpacity style={[styles.item, {
        height,
        width,
        margin: this.state.itemOffset
      }]} onPress={this.props.onSelect(row)} >
        <View style={styles.itemBackgroundContainer}>
          <TextileImage
            imageId={row.item.photo.id}
            path={'small'}
            style={[styles.itemImage, {
              width: this.state.itemWidth,
              height: this.state.itemHeight}]}
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
    const productHeight = this.state.itemHeight + this.state.itemMargin
    return {
      length: productHeight,
      offset: productHeight * index,
      index
    }
  }

  // The default function if no Key is provided is index
  // an identifiable key is important if you plan on
  // item reordering.  Otherwise index is fine
  keyExtractor = (item, index) => item.photo.id

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
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 1
          }}
        >
          <Image style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            resizeMode: 'stretch',
            position: 'absolute'
          }} source={require('../Images/backgrounds/TextileBackground.png')} />
        </View>
        {
          this.props.items.length && this.state.numColumns > 1 ? (
            <FlatList
              key={this.state.flatListKey}
              style={[styles.listContainer, {padding: this.state.itemOffset}]}
              data={this.props.items}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderRow.bind(this)}
              getItemLayout={this._getItemLayout}
              numColumns={this.state.numColumns}
              windowSize={this.oneScreensWorth}
              initialNumToRender={this.oneScreensWorth}
              onEndReachedThreshold={0.55}
              onRefresh={this.props.onRefresh}
              refreshing={this.props.refreshing}
              columnWrapperStyle={styles.columnWrapper}
            />
          ) : this.props.items.length ? (
            <FlatList
              key={this.state.flatListKey}
              style={[styles.listContainer, {padding: this.state.itemOffset}]}
              data={this.props.items}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderRow.bind(this)}
              getItemLayout={this._getItemLayout}
              numColumns={this.state.numColumns}
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
