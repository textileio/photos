// @flow
import React from 'react'
import {Image, TouchableWithoutFeedback} from 'react-native'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import TextileActions from '../Redux/TextileRedux'
import IpfsNodeActions from '../Redux/IpfsNodeRedux'
import UIActions from '../Redux/UIRedux'
import styles from '../Navigation/Styles/NavigationStyles'

class TextilePhotos extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      headerTitle: <TouchableWithoutFeedback delayLongPress={3000} onLongPress={params.toggleVerboseUi}>
        <Image style={styles.headerTitleImage} source={require('../Images/TextileHeader.png')} />
      </TouchableWithoutFeedback>
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({ toggleVerboseUi: this.props.toggleVerboseUi })
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
      <PhotoGrid
        items={this.props.items}
        loadingText={this.props.loadingText}
        onSelect={this.onSelect}
        onRefresh={this.onRefresh.bind(this)}
        refreshing={this.props.refreshing}
        placeholderText={this.props.placeholderText}
        displayImages={this.props.displayImages}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const thread = ownProps.navigation.state.params.thread
  let allItemsObj = state.ipfs.threads[thread].items.reduce((o, item, index) => ({...o, [item.hash]: { index, hash: item.hash, caption: item.caption, state: 'complete' }}), {})
  for (const processingItem of state.textile.images.items) {
    const item = allItemsObj[processingItem.hash]
    if (item) {
      const updatedItem = item.merge(processingItem)
      allItemsObj = allItemsObj.set(processingItem.hash, updatedItem)
    }
  }
  const updatedItems = Object.values(allItemsObj).sort((a, b) => a.index > b.index)

  const nodeStatus = state.ipfs.nodeState.error
    ? 'Error - ' + state.ipfs.nodeState.error.message
    : state.ipfs.nodeState.state

  const placeholderText = state.ipfs.nodeState.state !== 'started'
    ? 'IPFS Status:\n' + nodeStatus
    : (thread === 'default'
    ? 'Any new photos you take will be added to your Textile wallet.'
    : 'Share your first photo to the All Users thread.')
  return {
    thread,
    items: updatedItems,
    refreshing: state.ipfs.threads[thread].querying,
    displayImages: state.ipfs.nodeState.state === 'started',
    placeholderText
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewPhoto: (index, thread) => { dispatch(UIActions.viewPhotoRequest(index, thread)) },
    refresh: thread => { dispatch(IpfsNodeActions.getPhotoHashesRequest(thread)) },
    toggleVerboseUi: () => { dispatch(TextileActions.toggleVerboseUi()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
