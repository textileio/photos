import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
  LayoutChangeEvent
} from 'react-native'
import Icon from '@textile/react-native-icon'
import Toast from 'react-native-easy-toast'
import { color } from '../styles'
import styles from './Styles/PhotoGridStyles'
import TextileImage from './TextileImage'
import { SharingPhoto } from '../Redux/UIRedux'

export interface GalleryPhoto {
  block: string
  data: string
}
export type GalleryDoubles = GalleryPhoto[]

interface ScreenProps {
  threadId: string
  photoPairs: GalleryDoubles[]
  selectPhoto: (block: string) => void
  showImagePicker: (type: string) => void
}

interface State {
  componentHeight: number
}
class HorizontalGrid extends React.Component<ScreenProps, State> {
  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 40

  state = {
    componentHeight: 220
  }
  toast?: Toast

  _getToast(errorMessage?: string) {
    return () => {
      if (errorMessage && this.toast) {
        this.toast.show(errorMessage, 2000)
      }
    }
  }

  /* ***********************************************************
  * `renderRow` function. How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={item.title} description={item.description} />
  *************************************************************/
  renderCell = (photo: GalleryPhoto) => {
    const callback = () => {
      this.props.selectPhoto(photo.block)
    }

    const width = (this.state.componentHeight - 1) / 2 - 2
    const height = width
    return (
      <TouchableOpacity
        style={{ ...styles.item, height, width }}
        onPress={callback}
        activeOpacity={0.85}
      >
        <View style={styles.itemBackgroundContainer}>
          <TextileImage
            target={photo.data}
            index={0}
            forMinWidth={300}
            style={{ ...styles.itemImage, height, width }}
            resizeMode={'cover'}
          />
        </View>
      </TouchableOpacity>
    )
  }
  renderRow = (row: ListRenderItemInfo<GalleryDoubles>) => {
    const { item } = row
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {this.renderCell(item[0])}
        {item.length > 1 && this.renderCell(item[1])}
      </View>
    )
  }

  showCameraRoll = () => {
    this.props.showImagePicker('camera-roll')
  }
  showCamera = () => {
    this.props.showImagePicker('camera')
  }

  renderHeader = () => {
    const height = (this.state.componentHeight - 2) / 2 - 2
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            ...styles.item,
            height,
            alignContent: 'center',
            justifyContent: 'center',
            width: styles.item.width / 3
          }}
          onPress={this.showCamera}
        >
          <Icon name="camera" color={color.grey_3} size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.19}
          style={{
            ...styles.item,
            height,
            alignContent: 'center',
            justifyContent: 'center',
            width: styles.item.width / 3
          }}
          onPress={this.showCameraRoll}
        >
          <Icon name="items" color={color.grey_3} size={24} />
        </TouchableOpacity>
      </View>
    )
  }
  onLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout
    if (layout.height && layout.height > 10) {
      this.setState({ componentHeight: layout.height })
    }
  }

  render() {
    return (
      <View style={{ ...styles.container }} onLayout={this.onLayout}>
        {this.props.photoPairs.length ? (
          <FlatList
            ListHeaderComponent={this.renderHeader}
            horizontal={true}
            style={styles.listContainer}
            data={this.props.photoPairs}
            /* tslint:disable-next-line */
            renderItem={this.renderRow}
            windowSize={this.oneScreensWorth}
            initialNumToRender={this.oneScreensWorth}
            onEndReachedThreshold={0.55}
            extraData={this.state.componentHeight}
          />
        ) : (
          <View style={styles.emptyListStyle}>
            <Text style={styles.noPhotos}>{'no images'}</Text>
          </View>
        )}
      </View>
    )
  }
}

export default HorizontalGrid
