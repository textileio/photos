import React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { ScrollView, ViewStyle } from 'react-native'

import { Photo } from '../Models/TextileTypes'
import { RootState, RootAction } from '../Redux/Types'

import ThreadDetailCard from '../SB/components/ThreadDetailCard'

const CONTAINER: ViewStyle = {
  backgroundColor: '#FAFCFE'
}

interface StateProps {
  photo: Photo
}

class PhotoScreen extends React.Component<StateProps & NavigationScreenProps<{}>> {

  static navigationOptions = {
    title: 'Photo'
  }

  onComment = () => {
    this.props.navigation.navigate('Comments')
  }

  render () {
    return (
      <ScrollView style={CONTAINER}>
        <ThreadDetailCard
          photo={this.props.photo}
          onComment={this.onComment}
          recentCommentsCount={5}
          maxLinesPerComment={5}
        />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  if (!state.photoViewing.viewingPhoto) {
    throw Error('No viewing photo')
  }
  return {
    photo: state.photoViewing.viewingPhoto
  }
}

export default connect(mapStateToProps)(PhotoScreen)
