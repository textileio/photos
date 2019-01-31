import React from 'react'
import { Image, ImageStyle, Text, TextStyle, View, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import Button from '../../../Components/Button'
import { NodeState } from '../../../SDK/types'
import { RootAction, RootState } from '../../../Redux/Types'
import * as s from '../../../Themes/Constants'

const CONTAINER: ViewStyle = {
  flex: 1,
  marginTop: '33%',
  paddingHorizontal: s.MARGIN_STANDARD,
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

interface OwnProps {
  onSuccess?: () => void
}

interface StateProps {
  processing: boolean
  error?: string
  buttonText: string
  complete: boolean
}

interface DispatchProps {
  startMigration: () => void
}

type Props = OwnProps & StateProps & DispatchProps

class MigrationScreen extends React.Component<Props> {

  static getDerivedStateFromProps (props: Props) {
    if (props.complete || props.error) {
      setTimeout(props.onSuccess, 1000)
    }
    // tslint:disable-next-line no-null-keyword
    return null
  }

  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <View style={CONTAINER}>
        <Image style={IMAGE} source={require('../../../Containers/OnboardingScreen/statics/sync.png')} />
        <Text style={TITLE}>Data Migration Needed</Text>
        <Text style={SUBTITLE}>Please start the migration and leave Textile running in the foreground until complete.</Text>
        <Button
          text={this.props.buttonText}
          disabled={this.props.processing || this.props.complete}
          processing={this.props.processing}
          onPress={this.props.startMigration}
          style={ITEM}
        />
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  const nodeState = state.textile.nodeState.state
  return {
    processing: /*nodeState !== NodeState.migrationNeeded &&*/ nodeState !== NodeState.started,
    buttonText: /*nodeState === NodeState.migrationNeeded ? 'Start Migration' :*/ 'Complete!',
    complete: nodeState === NodeState.started,
    error: state.textile.nodeState.error
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  startMigration: () => {} // dispatch(TextileNodeActions.initMigration())
})

export default connect(mapStateToProps, mapDispatchToProps)(MigrationScreen)
