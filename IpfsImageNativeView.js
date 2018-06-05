//  Created by react-native-create-bridge

import React, { Component } from 'react'
import { requireNativeComponent } from 'react-native'

const IpfsImage = requireNativeComponent('IpfsImage', IpfsImageView)

export default class IpfsImageView extends Component {
  render () {
    return <IpfsImage {...this.props} />
  }
}

IpfsImageView.propTypes = {
  exampleProp: React.PropTypes.string
}
