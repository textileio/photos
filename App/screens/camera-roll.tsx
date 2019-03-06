import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, TouchableOpacity, Text } from 'react-native'
import { RootAction } from '../Redux/Types'

import { photosActions } from '../features/photos'

interface DispatchProps {
  queryPhotos: () => void
  refreshPhotos: () => void
}

class CameraRoll extends Component<DispatchProps> {

  componentDidMount() {
    this.props.refreshPhotos()
  }

  render() {
    return (
      <View>
        <TouchableOpacity style={{ paddingTop: 40 }} onPress={this.props.queryPhotos}>
          <Text>Do it</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  queryPhotos: () => dispatch(photosActions.queryCameraRoll.request()),
  refreshPhotos: () => dispatch(photosActions.refreshPhotos.request(undefined))
})

export default connect(undefined, mapDispatchToProps)(CameraRoll)
