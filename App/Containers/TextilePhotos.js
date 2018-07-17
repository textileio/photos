import React from 'react'
import {View, Text, Image, TouchableWithoutFeedback, Share} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import HeaderButtons from 'react-navigation-header-buttons'
import ActionSheet from 'react-native-actionsheet'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import style from './Styles/TextilePhotosStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'

class TextilePhotos extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    const headerTitle = params.threadName === 'default' ? (
      <TouchableWithoutFeedback delayLongPress={3000} onLongPress={params.toggleVerboseUi}>
        <Image style={navStyles.headerTitleImage} source={require('../Images/TextileHeader.png')} />
      </TouchableWithoutFeedback>
    ) : params.threadName
    const headerRight = params.threadName === 'default' ? null : (
      <HeaderButtons IconComponent={Icon} iconSize={33} color="white">
        <HeaderButtons.Item title="options" iconName="ios-more" onPress={params.showActionSheet} />
      </HeaderButtons>
    )
    return {
      headerTitle,
      headerRight
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      toggleVerboseUi: this.props.toggleVerboseUi,
      threadName: this.props.threadName,
      showActionSheet: this.showActionSheet.bind(this)
    })
  }

  onSelect = (row) => {
    return () => {
      this.props.viewPhoto(row.index, this.props.threadName)
    }
  }

  onRefresh () {
    this.props.refresh(this.props.threadName)
  }

  showActionSheet() {
    this.actionSheet.show()
  }

  handleActionSheetResponse (index: number) {
    if (index === 0) {
      this.props.invite(this.props.threadName, this.props.threadId)
    } else if (index === 1) {
      this.props.leaveThread(this.props.threadName)
    }
  }

  render () {
    return (
      <View style={style.container}>
        <PhotoGrid
          items={this.props.items}
          onSelect={this.onSelect}
          onRefresh={this.onRefresh.bind(this)}
          refreshing={this.props.refreshing}
          placeholderText={this.props.placeholderText}
          displayImages={this.props.displayImages}
        />
        <ActionSheet
          ref={o => this.actionSheet = o}
          title={this.props.threadName + ' Thread Actions'}
          options={['Invite Others', 'Leave Thread', 'Cancel']}
          cancelButtonIndex={2}
          onPress={this.handleActionSheetResponse.bind(this)}
        />
        {this.props.verboseUi &&
          <View style={style.bottomOverlay} >
            <Text style={style.overlayText}>{this.props.nodeStatus}</Text>
          </View>
        }
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // TODO: Can this be a selector?
  const threadName = ownProps.navigation.state.params.threadName
  const threadId = ownProps.navigation.state.params.threadId
  let allItemsObj = state.ipfs.threads[threadName].items.reduce((o, item, index) => ({...o, [item.hash]: { index, hash: item.hash, caption: item.caption, state: 'complete' }}), {})
  for (const processingItem of state.textile.images.items) {
    for (const pinRequest of processingItem.pinRequests) {
      const item = allItemsObj[pinRequest.hash]
      if (item) {
        const updatedItem = { ...item, ...processingItem }
        allItemsObj[pinRequest.hash] = updatedItem
        break
      }
    }
  }
  const updatedItems = Object.values(allItemsObj).sort((a, b) => a.index > b.index)

  const nodeStatus = state.ipfs.nodeState.error
    ? 'Error - ' + state.ipfs.nodeState.error.message
    : state.ipfs.nodeState.state

  const placeholderText = state.ipfs.nodeState.state !== 'started'
    ? 'Wallet Status:\n' + nodeStatus
    : (threadName === 'default'
    ? 'Any new photos you take will be added to your Textile wallet.'
    : 'Share your first photo to the ' + threadName + ' thread.')
  return {
    threadId,
    threadName,
    items: updatedItems,
    refreshing: state.ipfs.threads[threadName].querying,
    displayImages: state.ipfs.nodeState.state === 'started',
    placeholderText,
    nodeStatus,
    verboseUi: state.preferences.verboseUi
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewPhoto: (index, threadName) => { dispatch(UIActions.viewPhotoRequest(index, threadName)) },
    refresh: (threadName: string) => { dispatch(TextileNodeActions.getPhotoHashesRequest(threadName)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) },
    invite: (name: string, pubKey: string) => { dispatch(ThreadsActions.addExternalInviteRequest(name, pubKey)) },
    leaveThread: (threadName: string) => { dispatch(ThreadsActions.removeThreadRequest(threadName)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
