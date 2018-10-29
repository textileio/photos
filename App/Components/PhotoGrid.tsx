import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux/index'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity, ListRenderItemInfo
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import Toast from 'react-native-easy-toast'

import { RootAction } from '../Redux/Types'
import ProcessingImagesActions from '../Redux/ProcessingImagesRedux'
import {IPhotoGridType, Photo, PhotoId} from '../Models/TextileTypes'
import {IProcessingImageProps} from './ProcessingImage'
import ProgressiveImage from './ProgressiveImage'
import ProcessingWalletImageCard from './ProcessingWalletImage'

// Styles
import { Colors } from '../Themes'
import styles, { PRODUCT_ITEM_HEIGHT, PRODUCT_ITEM_MARGIN, numColumns } from './Styles/PhotoGridStyles'

interface DispatchProps {
  retryShare: (uuid: string) => void
  cancelShare: (uuid: string) => void
}

interface ScreenProps {
  items: IPhotoGridType[]
  onSelect: (photo: Photo) => () => void
  onRefresh: () => void
  refreshing: boolean
  placeholderText: string
  displayImages: boolean
  verboseUi: boolean
}

class PhotoGrid extends React.Component<ScreenProps & DispatchProps & NavigationScreenProps<{}>> {
  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 20

  toast?: Toast

  _getToast (errorMessage?: string) {
    return () => {
      if (errorMessage && this.toast) {
        this.toast.show(errorMessage, 2000)
      }
    }
  }
  _getOverlay (item: IPhotoGridType) {
    const processing = item.photo as IProcessingImageProps
    const id = item.id as string // We know this is a processing image so the id is a string
    return (
      <ProcessingWalletImageCard
        {...processing}
        /* tslint:disable-next-line */
        retry={() => { this.props.retryShare(id) }}
        /* tslint:disable-next-line */
        cancel={() => { this.props.cancelShare(id) }}
        /* tslint:disable-next-line */
        displayError={this._getToast(processing.errorMessage)}
        height={PRODUCT_ITEM_HEIGHT}
        width={PRODUCT_ITEM_HEIGHT}
      />
    )
  }
  /* ***********************************************************
  * `renderRow` function. How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={item.title} description={item.description} />
  *************************************************************/
  renderRow (row: ListRenderItemInfo<IPhotoGridType>) {
    const { item } = row
    switch (item.type) {
      case 'photo':
        return (
          <TouchableOpacity
            style={styles.item}
            /* tslint:disable-next-line */
            onPress={this.props.onSelect(row.item.photo as Photo)}
          >
            <View style={styles.itemBackgroundContainer}>
              <ProgressiveImage
                imageId={row.item.id as PhotoId}
                showPreview={true}
                forMinWidth={PRODUCT_ITEM_HEIGHT}
                style={styles.itemImage}
                resizeMode={'cover'}
              />
            </View>
            <View style={styles.itemOverlay}>
              {/* TODO: Add verbose back */}
            </View>
          </TouchableOpacity>
        )
      case 'processingItem':
        return (
          <View style={styles.item}>
            {this._getOverlay(item)}
          </View>
        )
      default:
        return (
          <View style={styles.item} >
            <View style={styles.itemBackgroundContainer} />
          </View>
        )
    }
  }

  _getItemLayout = (length: any, index: number) => {
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
  keyExtractor = (item: IPhotoGridType) => item.id

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
          this.props.items.length ? (
            <FlatList
              style={styles.listContainer}
              data={this.props.items}
              keyExtractor={this.keyExtractor}
              /* tslint:disable-next-line */
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
        <Toast
          ref={(toast) => { this.toast = toast ? toast : undefined }}
          position='center'
        />
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    retryShare: (uuid: string) => { dispatch(ProcessingImagesActions.retry(uuid)) },
    cancelShare: (uuid: string) => { dispatch(ProcessingImagesActions.cancelRequest(uuid)) }
  }
}

export default connect(undefined, mapDispatchToProps)(PhotoGrid)
