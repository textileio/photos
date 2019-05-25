import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  View,
  FlatList,
  Image,
  ListRenderItemInfo,
  ViewStyle,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import Toast from 'react-native-easy-toast'
import { NavigationScreenProps } from 'react-navigation'

import Avatar from '../Components/Avatar'
import TextileImage from '../Components/TextileImage'
import {
  Item as HeaderItem,
  TextileHeaderButtons
} from '../Components/HeaderButtons'
import { RootAction, RootState } from '../Redux/Types'
import { photosActions, photosSelectors } from '../features/photos'
import { Item } from '../features/photos/models'
import { color } from '../styles'

const { width } = Dimensions.get('window')
const itemSize = width / 3

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

interface StateProps {
  items: ReadonlyArray<Item>
  refreshing: boolean
}

interface DispatchProps {
  queryPhotos: () => void
  refreshPhotos: () => void
}

interface NavProps {
  openDrawer: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

class Photos extends Component<Props> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const openDrawer = navigation.getParam('openDrawer')
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <HeaderItem
          title="Account"
          onPress={openDrawer}
          ButtonElement={
            <Avatar style={{ width: 24, height: 24 }} self={true} />
          }
          buttonWrapperStyle={{ margin: 11 }}
        />
      </TextileHeaderButtons>
    )

    const headerRight = (
      <TextileHeaderButtons>
        <HeaderItem title="Add Group" iconName="plus" />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Photos',
      headerRight
    }
  }

  toast?: Toast

  componentDidMount() {
    this.props.refreshPhotos()
    this.props.navigation.setParams({
      openDrawer: this.openDrawer
    })
  }

  render() {
    return (
      <View style={CONTAINER}>
        <FlatList
          data={this.props.items}
          renderItem={this.renderRow}
          keyExtractor={this.keyExtractor}
          onRefresh={this.props.refreshPhotos}
          refreshing={this.props.refreshing}
          numColumns={3}
        />
        <Toast
          position={'center'}
          ref={ref => (this.toast = ref ? ref : undefined)}
        />
      </View>
    )
  }

  keyExtractor = (item: Item) =>
    item.type === 'files'
      ? item.files.target
      : item.processingPhoto.photo.assetId

  renderRow = (row: ListRenderItemInfo<Item>) => {
    if (row.item.type === 'files') {
      const { files, target } = row.item.files
      const fileIndex = files.length > 0 && files[0].index ? files[0].index : 0
      return (
        <TextileImage
          target={target}
          index={fileIndex}
          forMinWidth={itemSize}
          resizeMode="cover"
          style={{ width: itemSize, height: itemSize }}
        />
      )
    } else {
      const { photo, error } = row.item.processingPhoto
      const uri = `file://${photo.path}`
      return (
        <View style={{ width: itemSize, height: itemSize }}>
          <Image
            key={photo.assetId}
            style={{ width: itemSize, height: itemSize }}
            source={{ uri }}
          />
          {error && (
            <TouchableOpacity
              onPress={this.showToast(error)}
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: 'red',
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 6,
                  position: 'absolute',
                  right: 5,
                  bottom: 5
                }}
              />
            </TouchableOpacity>
          )}
          {!error && (
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 6,
                position: 'absolute',
                right: 5,
                bottom: 5
              }}
            />
          )}
        </View>
      )
    }
  }

  showToast = (message: string) => {
    return () => {
      if (this.toast) {
        this.toast.show(message)
      }
    }
  }

  openDrawer = () => {
    this.props.navigation.openDrawer()
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    items: photosSelectors.items(state.photos),
    refreshing: state.photos.photosData.querying
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  queryPhotos: () => dispatch(photosActions.queryCameraRoll.request()),
  refreshPhotos: () => dispatch(photosActions.refreshPhotos.request(undefined))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Photos)
