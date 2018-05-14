// @flow
import React from 'react'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import IpfsNodeActions from '../Redux/IpfsNodeRedux'
import UIActions from '../Redux/UIRedux'

class TextilePhotos extends React.PureComponent {
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
  const placeholderText = thread === 'default'
    ? 'Any new photos you take will be added to your Textile wallet.'
    : 'Share your first photo to the Beta Testers Thread.'
  return {
    thread,
    items: updatedItems,
    loadingText: state.ipfs.nodeState.state,
    refreshing: state.ipfs.threads[thread].querying,
    placeholderText
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewPhoto: (index, thread) => { dispatch(UIActions.viewPhotoRequest(index, thread)) },
    refresh: thread => { dispatch(IpfsNodeActions.getPhotoHashesRequest(thread)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
