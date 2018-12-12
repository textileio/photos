import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'

import FatalErrorView from '../Components/FatalErrorView'

import { RootState } from '../Redux/Types'
import { NodeState, MigrationState } from '../Redux/TextileNodeRedux'

interface StateProps {
  migrationNeeded: boolean
  onboarded: boolean
  nodeStarted: boolean,
  nodeError?: string
}

type Props = StateProps & NavigationScreenProps<{}>

class StatusCheck extends React.Component<Props, {}> {

  static getDerivedStateFromProps (props: Props, state: {}) {
    if (props.migrationNeeded) {
      props.navigation.navigate('Migration')
    } else if (!props.nodeError && props.nodeStarted && !props.onboarded) {
      props.navigation.navigate('OnboardingNavigation')
    } else if (!props.nodeError && props.nodeStarted) {
      props.navigation.navigate('PrimaryNavigation')
    }
    // tslint:disable-next-line no-null-keyword
    return null
  }

  constructor (props: Props) {
    super(props)
    this.state = {}
  }

  render () {
    if (this.props.nodeError) {
      return (
        <FatalErrorView message={this.props.nodeError} />
      )
    } else {
      return (
        <View style={{ flex: 1 }}>
          <ActivityIndicator />
        </View>
      )
    }
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    migrationNeeded: state.textileNode.nodeState.state === NodeState.migrationNeeded,
    onboarded: state.preferences.onboarded,
    nodeStarted: state.textileNode.nodeState.state === NodeState.started,
    nodeError: state.textileNode.nodeState.error
  }
}

export default connect(mapStateToProps, undefined)(StatusCheck)
