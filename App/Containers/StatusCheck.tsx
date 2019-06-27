import React from 'react'
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'

import Loading from '../Components/Loading'
import FatalErrorView from '../Components/FatalErrorView'

import { RootState } from '../Redux/Types'
import { TextileEventsSelectors } from '../Redux/TextileEventsRedux'
import { color } from '../styles'

interface StateProps {
  onboarded: boolean
  nodeStarted: boolean
  nodeError?: string
}

type Props = StateProps & NavigationScreenProps<{}>

class StatusCheck extends React.Component<Props, {}> {
  static getDerivedStateFromProps(props: Props, state: {}) {
    if (!props.nodeError && props.nodeStarted && !props.onboarded) {
      props.navigation.navigate('OnboardingNavigation')
    } else if (!props.nodeError && props.nodeStarted) {
      props.navigation.navigate('ModalNavigation')
    }
    // tslint:disable-next-line no-null-keyword
    return null
  }

  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  render() {
    if (this.props.nodeError) {
      return <FatalErrorView message={this.props.nodeError} />
    } else {
      return <Loading color={color.brandBlue} text={"Waiting for node to start..."} />
    }
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    onboarded: state.preferences.onboarded,
    nodeStarted: TextileEventsSelectors.started(state),
    nodeError: state.textile.nodeState.error
  }
}

export default connect(
  mapStateToProps,
  undefined
)(StatusCheck)
