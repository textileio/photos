import React, { Fragment } from 'react'
import { Text, TextStyle, View, ViewStyle, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import Button from '../../Components/Button'
import MigrationActions from '../../Redux/MigrationRedux'
import { downloadsCount, completeDownloadsCount, localProcessingTasksCount, completeLocalProcessingTasksCount, overallUploadProgress } from '../../Redux/MigrationSelectors'
import { RootAction, RootState } from '../../Redux/Types'
import * as s from '../../Themes/Constants'

const CONTAINER: ViewStyle = {
  flex: 1,
  padding: s.MARGIN_STANDARD,
  backgroundColor: s.COLOR_BACKGROUND_PRIMARY
}

const MAIN_GROUP: ViewStyle = {
  flex: 1
}

const ITEM: ViewStyle = {
  marginBottom: s.ITEM_SPACING_LARGE
}

const TITLE: TextStyle = {
  marginTop: '70%',
  ...ITEM,
  ...s.HEADER
}

const SUBTITLE: TextStyle = {
  ...ITEM,
  ...s.H2
}

const TEXT: TextStyle = {
  ...ITEM,
  ...s.H1
}

const ERROR: TextStyle = {
  ...ITEM,
  ...s.H1,
  color: s.COLOR_BRAND_RED
}

const LINK: TextStyle = {
  fontFamily: s.FONT_FAMILY_REGULAR,
  fontSize: s.FONT_SIZE_REGULAR,
  color: s.COLOR_GREY_MEDIUM,
  textDecorationLine: 'underline',
  textAlign: 'center'
}

interface StateProps {
  description?: string,
  progress?: string
  error?: string
}

interface DispatchProps {
  retry: () => void
  cancel: () => void
}

type Props = StateProps & DispatchProps

class MigrationScreen extends React.Component<Props> {

  render () {
    return (
      <View style={CONTAINER}>
        <View style={MAIN_GROUP}>
          <Text style={TITLE}>Migrating:</Text>
          <Text style={SUBTITLE}>{this.props.description}</Text>
          <Text style={TEXT}>{this.props.progress}</Text>
          {this.props.error &&
            <Fragment>
              <Text style={ERROR}>{this.props.error}</Text>
              <Button
                text='Retry'
                onPress={this.props.retry}
                style={ITEM}
              />
            </Fragment>
          }
          {!this.props.error &&
            <ActivityIndicator size='large' animating={true} color={s.COLOR_BRAND_BLUE} style={ITEM} />
          }
        </View>
        <Text style={LINK} onPress={this.props.cancel}>Cancel</Text>
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
    progress = overallProgress ? `${Math.floor(overallProgress * 100)}%` : '0%'
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
    progress,
    error: state.migration.error
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  cancel: () => dispatch(MigrationActions.cancelMigration()),
  retry: () => dispatch(MigrationActions.retryMigration())
})

export default connect(mapStateToProps, mapDispatchToProps)(MigrationScreen)
