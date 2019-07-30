import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect, DispatchProp } from 'react-redux'
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
import ActionSheet from 'react-native-actionsheet'
import { NavigationScreenProps } from 'react-navigation'

import Avatar from '../Components/Avatar'
import TextileImage from '../Components/TextileImage'
import {
  Item as HeaderItem,
  TextileHeaderButtons
} from '../Components/HeaderButtons'
import { RootAction, RootState } from '../Redux/Types'
import { groupActions, groupSelectors } from '../features/group'
import { cameraRollThread } from '../Redux/PhotoViewingSelectors'
import { Item } from '../features/group/models'
import { color } from '../styles'
import { FeedItemType } from '@textile/react-native-sdk'

const { width } = Dimensions.get('window')
const itemSize = width / 3

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

interface StateProps {
  cameraRollThreadId?: string
  items: ReadonlyArray<Item>
  refreshing: boolean
}

interface DispatchProps extends DispatchProp<RootAction> {
  queryPhotos: () => void
  clearProcessingPhotos: () => void
}
interface MergeProps {
  refresh: () => void
}

interface NavProps {
  openDrawer: () => void
  showActionSheet: () => void
}

type Props = StateProps &
  DispatchProps &
  MergeProps &
  NavigationScreenProps<NavProps>

class Photos extends Component<Props> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const openDrawer = navigation.getParam('openDrawer')
    const showActionSheet = navigation.getParam('showActionSheet')
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
        <HeaderItem
          title="More"
          iconName="more-vertical"
          onPress={showActionSheet}
        />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Photos',
      headerRight
    }
  }

  toast?: Toast

  actionSheet: any

  componentDidMount() {
    this.props.refresh()
    this.props.navigation.setParams({
      openDrawer: this.openDrawer,
      showActionSheet: this.showActionSheet
    })
  }

  render() {
    return (
      <View style={CONTAINER}>
        <FlatList
          data={this.props.items}
          renderItem={this.renderRow}
          keyExtractor={this.keyExtractor}
          onRefresh={this.props.refresh}
          refreshing={this.props.refreshing}
          numColumns={3}
        />
        <Toast
          position={'center'}
          ref={ref => (this.toast = ref ? ref : undefined)}
        />
        <ActionSheet
          ref={(o: any) => {
            this.actionSheet = o
          }}
          title={'Options'}
          options={['Clear processing items', 'Cancel']}
          cancelButtonIndex={1}
          onPress={this.handleActionSheetResponse}
        />
      </View>
    )
  }

  keyExtractor = (item: Item) =>
    item.type === 'addingMessage' || item.type === 'addingPhoto'
      ? item.key
      : item.block

  renderRow = (row: ListRenderItemInfo<Item>) => {
    if (row.item.type === 'addingMessage') {
      return null
    } else if (row.item.type === 'addingPhoto') {
      return null
    } else if (row.item.type === FeedItemType.Files) {
      const files = row.item.value
      const data = files.data
      return (
        <TextileImage
          target={data}
          index={0}
          forMinWidth={itemSize}
          resizeMode="cover"
          style={{ width: itemSize, height: itemSize }}
        />
      )
    } else {
      return null
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

  showActionSheet = () => {
    this.actionSheet.show()
  }

  handleActionSheetResponse = (index: number) => {
    if (index === 0) {
      this.props.clearProcessingPhotos()
    }
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  const cameraRoll = cameraRollThread(state)
  const cameraRollThreadId = cameraRoll ? cameraRoll.id : undefined
  const items = cameraRoll
    ? groupSelectors.groupItems(state.group, cameraRoll.id)
    : []
  return {
    cameraRollThreadId,
    items,
    refreshing: state.group.addPhoto.queryData.querying
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  queryPhotos: () => dispatch(groupActions.addPhoto.queryCameraRoll.request()),
  clearProcessingPhotos: () => {}, // TODO: Maybe create this action, but really should use cancel,
  dispatch
})

const mergeProps = (
  stateProps: StateProps,
  dispatchProps: DispatchProps,
  ownProps: NavigationScreenProps<NavProps>
): Props => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    refresh: () => {
      if (stateProps.cameraRollThreadId) {
        dispatchProps.dispatch(
          groupActions.feed.refreshFeed.request({
            id: stateProps.cameraRollThreadId
          })
        )
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Photos)
