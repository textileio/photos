import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { SafeAreaView, ViewStyle } from 'react-native'

import PageIndicator from '../../Components/page-indicator'
import { color } from '../../styles'
import { RootAction } from '../../Redux/Types'
import { initializationActions } from '../../features/initialization'

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

export interface OnboardingChildProps {
  onComplete?: () => void
}

interface DispatchProps {
  complete: () => void
}

type Props = DispatchProps

interface State {
  currentPage: number
}

class OnboardingContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentPage: 0
    }
  }

  render() {
    const validChildren = React.Children.map(this.props.children, child => {
      if (!React.isValidElement<OnboardingChildProps>(child)) {
        return undefined
      }
      return child
    }).reduce(
      (accum, current) => (current ? [...accum, current] : accum),
      [] as React.ReactElement<OnboardingChildProps>[]
    )
    const count = React.Children.count(validChildren)
    const augmentedChildren = validChildren.map((child, index) => {
      const onComplete =
        index === count - 1 ? this.props.complete : this.nextPage
      return React.cloneElement(child, {
        onComplete
      })
    })
    return (
      <SafeAreaView style={CONTAINER}>
        {augmentedChildren[this.state.currentPage]}
        <PageIndicator length={count} active={this.state.currentPage} />
      </SafeAreaView>
    )
  }

  nextPage = () => {
    this.setState({ currentPage: this.state.currentPage + 1 })
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    complete: () => dispatch(initializationActions.onboardingSuccess())
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(OnboardingContainer)
