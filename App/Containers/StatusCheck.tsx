import React from 'react'
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'

import Loading from '../Components/Loading'
import FatalErrorView from '../Components/FatalErrorView'
import Initialize from './Onboarding/initialize'

import { RootState } from '../Redux/Types'
import { TextileEventsSelectors } from '../Redux/TextileEventsRedux'
import {
  initializationSelectors,
  initializationModels
} from '../features/initialization'
import { color } from '../styles'

interface StateProps {
  initialized: boolean
  onboarded: boolean
  initializationPath?: initializationModels.InitializationPath
  nodeStarted: boolean
  nodeError?: string
}

type Props = StateProps & NavigationScreenProps<{}>

// This component serves two functions when the application starts
// 1. It ensures that the Textile Node, if initialized, has started.
// 2. It ensures that the user has completed onboarding.

class StatusCheck extends React.Component<Props> {
  // This is called on every re-render, whether it is from
  // a change in the props or from a call to local setState
  // Navigate to onboarding once the node has started or if the node
  // hasn't been initialized yet.
  static getDerivedStateFromProps(props: Props) {
    if (
      !props.nodeError &&
      props.initialized &&
      props.nodeStarted &&
      props.onboarded
    ) {
      props.navigation.navigate('PrimaryNav')
    }
    // tslint:disable-next-line no-null-keyword
    return null
  }

  componentDidMount() {
    if (!this.props.onboarded && this.props.initializationPath) {
      if (this.props.initializationPath === 'newAccount') {
        this.props.navigation.navigate('OnboardingNew')
      } else {
        this.props.navigation.navigate('OnboardingExisting')
      }
    }
  }

  render() {
    if (!this.props.initialized) {
      return <Initialize navigation={this.props.navigation} />
    } else if (this.props.nodeError) {
      return <FatalErrorView message={this.props.nodeError} />
    } else {
      return (
        <Loading
          color={color.brandBlue}
          text={'Waiting for node to start...'}
        />
      )
    }
  }
}

function mapStateToProps(state: RootState): StateProps {
  return {
    nodeStarted: TextileEventsSelectors.started(state),
    initialized: initializationSelectors.initialized(state.initialization),
    onboarded: state.initialization.onboarding.completed,
    initializationPath: state.initialization.onboarding.initializationPath,
    nodeError: state.textile.nodeState.error
  }
}

export default connect(
  mapStateToProps,
  undefined
)(StatusCheck)
