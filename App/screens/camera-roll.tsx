import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, TouchableOpacity, Text } from 'react-native'
import { RootAction } from '../Redux/Types'

import { photosActions } from '../features/photos'

interface DispatchProps {
  queryPhotos: () => void
}

class CameraRoll extends Component<DispatchProps> {

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

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  queryPhotos: () => dispatch(photosActions.queryPhotos.request())
})

export default connect(undefined, mapDispatchToProps)(CameraRoll)
