import React from 'react'
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'

import Loading from '../Components/Loading'
import FatalErrorView from '../Components/FatalErrorView'
import Initialize from '../screens/initialize'

import { RootState } from '../Redux/Types'
import { TextileEventsSelectors } from '../Redux/TextileEventsRedux'
import { initializationSelectors } from '../features/initialization'
import { color } from '../styles'

interface StateProps {
  nodeStarted: boolean
  nodeError?: string
}

type Props = StateProps & NavigationScreenProps<{}>

interface State {
  onboardingCompleted: boolean
}

// This component serves two functions when the application starts
// 1. It ensures that the Textile Node, if initialized, has started.
// 2. It ensures that the user has completed onboarding.

class StatusCheck extends React.Component<Props, State> {
  // This is called on every re-render, whether it is from
  // a change in the props or from a call to local setState
  static getDerivedStateFromProps(props: Props, state: State) {
    if (!props.nodeError && props.nodeStarted && state.onboardingCompleted) {
      props.navigation.navigate('PrimaryNav')
    }
    // tslint:disable-next-line no-null-keyword
    return null
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      onboardingCompleted: false
    }
  }

  render() {
    if (!this.state.onboardingCompleted) {
      // Return onboarding component here
      return (
        <Loading
          color={color.brandBlue}
          text={'Waiting for node to start...'}
        />
      )
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

  _onboardingCompleted = () => {
    this.setState({
      onboardingCompleted: true
    })
  }
}

function mapStateToProps(state: RootState): StateProps {
  return {
    nodeStarted: TextileEventsSelectors.started(state),
    nodeError: state.textile.nodeState.error
  }
}

export default connect(
  mapStateToProps,
  undefined
)(StatusCheck)
