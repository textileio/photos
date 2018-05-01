// @flow
import React from 'react'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'

class SharedPhotos extends React.PureComponent {
  onSelect = (row) => {
    return () => {
      this.props.navigation.navigate('PhotoViewer', row)
    }
  }

  render () {
    return (
      <PhotoGrid items={this.props.items} renderImages={this.props.renderImages} onSelect={this.onSelect} />
    )
  }
}

const mapStateToProps = state => {
  let allItemsObj = state.ipfs.threads.beta.hashes.reduce((o, hash, index) => ({...o, [hash]: { index, image: { hash }, state: 'complete' }}), {})
  for (const processingItem of state.textile.images.items) {
    const item = allItemsObj[processingItem.image.hash]
    if (item) {
      const updatedItem = item.merge(processingItem)
      allItemsObj = allItemsObj.set(processingItem.image.hash, updatedItem)
    }
  }
  const updatedItems = Object.values(allItemsObj).sort((a, b) => a.index > b.index)
  return {
    items: updatedItems,
    renderImages: state.ipfs.nodeState.state === 'started' && !state.ipfs.threads.beta.querying
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SharedPhotos)
