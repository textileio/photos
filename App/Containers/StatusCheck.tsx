import React from 'react'
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'

import Loading from '../Components/Loading'
import FatalErrorView from '../Components/FatalErrorView'

import { RootState } from '../Redux/Types'
import { TextileEventsSelectors } from '../Redux/TextileEventsRedux'
import { color } from '../styles'

interface StateProps {
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
  static getDerivedStateFromProps(props: Props) {
    if (!props.nodeError && props.nodeStarted) {
      props.navigation.navigate('Onboarding')
    }
    // tslint:disable-next-line no-null-keyword
    return null
  }

  render() {
    if (this.props.nodeError) {
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
    nodeError: state.textile.nodeState.error
  }
}

export default connect(
  mapStateToProps,
  undefined
)(StatusCheck)
