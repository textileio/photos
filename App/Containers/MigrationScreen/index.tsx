import React from 'react'
import { Image, ImageStyle, Text, TextStyle, View, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import Button from '../../Components/Button'
import TextileNodeActions, { NodeState } from '../../Redux/TextileNodeRedux'
import { downloadsCount, completeDownloadsCount, localProcessingTasksCount, completeLocalProcessingTasksCount, overallUploadProgress } from '../../Redux/MigrationSelectors'
import { RootAction, RootState } from '../../Redux/Types'
import * as s from '../../Themes/Constants'

const CONTAINER: ViewStyle = {
  flex: 1,
  padding: s.MARGIN_STANDARD,
  backgroundColor: s.COLOR_BACKGROUND_PRIMARY
}

const IMAGE: ImageStyle = {
  marginBottom: s.ITEM_SPACING_LARGE
}

const ITEM: ViewStyle = {
  marginBottom: s.ITEM_SPACING_LARGE
}

const TITLE: TextStyle = {
  ...ITEM,
  ...s.H2
}

const SUBTITLE: TextStyle = {
  ...ITEM,
  ...s.H1
}

interface StateProps {
  description?: string,
  progress?: string
}

class MigrationScreen extends React.Component<StateProps> {

  render () {
    return (
      <View style={CONTAINER}>
        <Image style={IMAGE} source={require('../../Containers/OnboardingScreen/statics/sync.png')} />
        <Text style={TITLE}>Data Migration</Text>
        <Text style={SUBTITLE}>{this.props.description}</Text>
        <Text style={SUBTITLE}>{this.props.progress}</Text>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  let description: string | undefined
  let progress: string | undefined
  if (state.migration.photoUploads) {
    description = 'Remotely pinning photos'
    const overallProgress = overallUploadProgress(state)
    progress = overallProgress ? `${Math.floor(overallProgress * 100)}%` : undefined
  } else if (state.migration.localProcessingTasks) {
    description = 'Adding photos to local IPFS node'
    progress = `${completeLocalProcessingTasksCount(state)}/${localProcessingTasksCount(state)}`
  } else if (state.migration.photoDownloads) {
    description = 'Downloading old photos'
    progress = `${completeDownloadsCount(state)}/${downloadsCount(state)}`
  } else if (state.migration.network) {
    description = 'Previous peers'
    progress = 'As your previous peers migrate to this new version of Textile Photos, they\'ll be added to your new peer list'
  } else if (state.migration.peerAnnouncement) {
    description = 'Your new peer identity'
    progress = 'This will allow your previous peers to find you when they migrate to the new Textile Photos'
  }
  return {
    description,
    progress
  }
}

export default connect(mapStateToProps, undefined)(MigrationScreen)
