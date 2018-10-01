import React from 'react'

import PhotoGridList from './PhotoGridList'

class PhotoGridListContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      active: 0,
      labelPosition: 0,
      elementPositions: {}
    }
  }

  onScroll = e => {
    const { elementPositions } = this.state

    const yScrollPosition = e.nativeEvent.contentOffset.y

    Object.keys(elementPositions).forEach(key => {
      if (yScrollPosition >= elementPositions[key].yPosition) {
        this.setState({
          active: key
        })
      }
    })
  }

  onLabelMounted = yPosition => {
    const { elementPositions } = this.state

    Object.keys(elementPositions).forEach(key => {
      this.setState({
        elementPositions: {
          ...elementPositions,
          [key]: {
            ...elementPositions[key],
            yPosition: elementPositions[key].yPosition + yPosition
          }
        }
      })
    })
  }

  onElementMounted = (id, yPosition) => {
    const { elementPositions } = this.state

    this.setState({
      elementPositions: {
        ...elementPositions,
        [id]: {
          id,
          yPosition
        }
      }
    })
  }

  render () {
    const { active } = this.state

    return (
      <PhotoGridList
        {...this.props}
        active={active}
        onScroll={this.onScroll}
        onLabelMounted={this.onLabelMounted}
        onElementMounted={this.onElementMounted}
      />
    )
  }
}

export default PhotoGridListContainer
