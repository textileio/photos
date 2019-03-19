import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, TouchableOpacity, Text } from 'react-native'
import { RootAction, RootState } from '../Redux/Types'

import { photosActions, photosSelectors } from '../features/photos'
import { Item } from '../features/photos/models'

interface StateProps {
  items: ReadonlyArray<Item>
}

interface DispatchProps {
  queryPhotos: () => void
  refreshPhotos: () => void
}

type Props = StateProps & DispatchProps

class CameraRoll extends Component<Props> {

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

const mapStateToProps = (state: RootState): StateProps => {
  return {
    items: photosSelectors.items(state.photos)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  queryPhotos: () => dispatch(photosActions.queryCameraRoll.request()),
  refreshPhotos: () => dispatch(photosActions.refreshPhotos.request(undefined))
})

export default connect(mapStateToProps, mapDispatchToProps)(CameraRoll)
