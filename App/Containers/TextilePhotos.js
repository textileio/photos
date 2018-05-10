// @flow
import React from 'react'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import IpfsNodeActions from '../Redux/IpfsNodeRedux'

class TextilePhotos extends React.PureComponent {
  onSelect = (row) => {
    return () => {
      this.props.navigation.navigate(
        'PhotoViewer', {
          initialIndex: row.index,
          thread: this.props.thread,
          sharable: this.props.sharable
        })
    }
  }

  onRefresh () {
    this.props.refresh(this.props.thread)
  }

  render () {
    return (
      <PhotoGrid
        items={this.props.items}
        renderImages={this.props.renderImages}
        onSelect={this.onSelect}
        onRefresh={this.onRefresh.bind(this)}
        refreshing={this.props.refreshing}
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
  return {
    thread,
    sharable: ownProps.navigation.state.params.sharable,
    items: updatedItems,
    renderImages: state.ipfs.nodeState.state === 'started',
    refreshing: state.ipfs.threads[thread].querying
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refresh: thread => { dispatch(IpfsNodeActions.getPhotoHashesRequest(thread)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
