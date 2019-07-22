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
  initialized: boolean
  onboarded: boolean
  nodeStarted: boolean
  nodeError?: string
}

type Props = StateProps & NavigationScreenProps<{}>

class StatusCheck extends React.Component<Props, {}> {
  static getDerivedStateFromProps(props: Props, state: {}) {
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

  constructor(props: Props) {
    super(props)
    this.state = {}
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
    initialized: initializationSelectors.initialized(state.initialization),
    onboarded: state.initialization.onboarding.completed,
    nodeStarted: TextileEventsSelectors.started(state),
    nodeError: state.textile.nodeState.error
  }
}

export default connect(
  mapStateToProps,
  undefined
)(StatusCheck)
