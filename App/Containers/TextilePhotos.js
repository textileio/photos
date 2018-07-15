import React from 'react'
import {View, Text, Image, Share, TouchableWithoutFeedback} from 'react-native'
import HeaderButtons from 'react-navigation-header-buttons'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import TextileActions from '../Redux/TextileRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'
import style from './Styles/TextilePhotosStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'
import Icon from 'react-native-vector-icons/Ionicons'

class TextilePhotos extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    const headerTitle = params.thread === 'default' ? (
      <TouchableWithoutFeedback delayLongPress={3000} onLongPress={params.toggleVerboseUi}>
        <Image style={navStyles.headerTitleImage} source={require('../Images/TextileHeader.png')} />
      </TouchableWithoutFeedback>
    ) : params.thread

    const headerRight = params.thread === 'default' ? '' : (
      <HeaderButtons IconComponent={Icon} OverflowIcon={<Icon name='ios-more' size={23} color='white' />} iconSize={33} color='white'>
        <HeaderButtons.Item title='add' iconName='ios-add' onPress={() => {
          Share.share({
            title: 'New photos to share',
            message: 'Come share photos with me on Textile Photos - a new decentralized photo sharing app',
            url: 'https://google.com' // <- throw the link in here
          })
          .then((a) => console.warn('', a)
          .catch((e) => console.warn('error', e)))
        }} />
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
      thread: this.props.thread
    })
  }

  onSelect = (row) => {
    return () => {
      this.props.viewPhoto(row.index, this.props.thread)
    }
  }

  onRefresh () {
    this.props.refresh(this.props.thread)
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
  const thread = ownProps.navigation.state.params.thread
  let allItemsObj = state.ipfs.threads[thread].items.reduce((o, item, index) => ({...o, [item.hash]: { index, hash: item.hash, caption: item.caption, state: 'complete' }}), {})
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
    : (thread === 'default'
    ? 'Any new photos you take will be added to your Textile wallet.'
    : 'Share your first photo to the ' + thread + ' thread.')
  return {
    thread,
    items: updatedItems,
    refreshing: state.ipfs.threads[thread].querying,
    displayImages: state.ipfs.nodeState.state === 'started',
    placeholderText,
    nodeStatus,
    verboseUi: state.preferences.verboseUi
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewPhoto: (index, thread) => { dispatch(UIActions.viewPhotoRequest(index, thread)) },
    refresh: (thread: string) => { dispatch(TextileNodeActions.getPhotoHashesRequest(thread)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
