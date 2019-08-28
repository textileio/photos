import React from 'react'
import {
  View,
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

  // how many images are required to split them into two rows per column
  wrapCount = 4 // since doubles this is 0.5 of the photo count
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
    const rows = this.props.photoPairs.length < this.wrapCount ? 1 : 2
    const width = (this.state.componentHeight - 1) / rows - 2
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
  renderSingle = (row: ListRenderItemInfo<GalleryPhoto>) => {
    const { item } = row
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {this.renderCell(item)}
      </View>
    )
  }
  renderDouble = (row: ListRenderItemInfo<GalleryDoubles>) => {
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

  renderFlatList = () => {
    if (this.props.photoPairs.length < this.wrapCount) {
      const flattened = ([] as GalleryPhoto[]).concat(...this.props.photoPairs)
      return (
        <FlatList
          ListHeaderComponent={this.renderHeader}
          horizontal={true}
          style={styles.listContainer}
          data={flattened}
          /* tslint:disable-next-line */
          renderItem={this.renderSingle}
          windowSize={this.oneScreensWorth}
          initialNumToRender={this.oneScreensWorth}
          onEndReachedThreshold={0.55}
          extraData={this.state.componentHeight}
        />
      )
    } else {
      return (
        <FlatList
          ListHeaderComponent={this.renderHeader}
          horizontal={true}
          style={styles.listContainer}
          data={this.props.photoPairs}
          /* tslint:disable-next-line */
          renderItem={this.renderDouble}
          windowSize={this.oneScreensWorth}
          initialNumToRender={this.oneScreensWorth}
          onEndReachedThreshold={0.55}
          extraData={this.state.componentHeight}
        />
      )
    }
  }
  render() {
    return (
      <View style={{ ...styles.container }} onLayout={this.onLayout}>
        {this.renderFlatList()}
      </View>
    )
  }
}

export default HorizontalGrid
