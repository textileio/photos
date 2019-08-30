import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Text, ViewStyle, TextStyle, View } from 'react-native'
import Icon from '@textile/react-native-icon'

import { OnboardingChildProps } from './onboarding-container'
import Loading from '../../Components/Loading'
import { RootAction, RootState } from '../../Redux/Types'
import {
  initializationActions,
  initializationSelectors
} from '../../features/initialization'
import { color, textStyle, spacing, size } from '../../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-evenly',
  padding: spacing._016,
  backgroundColor: color.screen_primary
}

const ITEM: ViewStyle = {
  marginBottom: spacing._016
}

const TITLE: TextStyle = {
  ...ITEM,
  ...textStyle.header_l
}

const INNER_CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: color.screen_primary
}

const TEXT: TextStyle = {
  ...textStyle.body_m,
  textAlign: 'center',
  marginTop: spacing._012
}

const ERROR: TextStyle = {
  ...TEXT,
  color: color.severe_3
}

const SUCCESS: TextStyle = {
  ...TEXT,
  color: color.grey_4
}

interface StateProps {
  statusText: string
  initialized: boolean
  error?: string
}

interface DispatchProps {
  initialize: () => void
}

type Props = StateProps & DispatchProps & OnboardingChildProps

class InitializeNew extends React.Component<Props> {
  componentDidMount() {
    if (this.props.initialized) {
      if (this.props.onComplete) {
        this.props.onComplete()
      }
    } else {
      this.props.initialize()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.initialized &&
      this.props.initialized !== prevProps.initialized
    ) {
      setTimeout(() => {
        if (this.props.onComplete) {
          this.props.onComplete()
        }
      }, 2000)
    }
  }

  static successComponent() {
    return (
      <View style={INNER_CONTAINER}>
        <Icon
          name={'circle-checked'}
          size={size._048}
          color={color.grey_4}
          style={{ alignSelf: 'center' }}
        />
        <Text style={SUCCESS}>Success!</Text>
      </View>
    )
  }

  errorComponent() {
    return (
      <View style={INNER_CONTAINER}>
        <Icon
          name={'alert-circle'}
          size={size._048}
          color={color.severe_3}
          style={{ alignSelf: 'center' }}
        />
        <Text style={ERROR}>{`Error: ${this.props.error}`}</Text>
      </View>
    )
  }

  render() {
    let element: JSX.Element
    if (this.props.error) {
      element = this.errorComponent()
    } else if (this.props.initialized) {
      element = InitializeNew.successComponent()
    } else {
      element = <Loading text={this.props.statusText} />
    }
    return (
      <View style={CONTAINER}>
        <Text style={TITLE}>Initializing Textile</Text>
        {element}
      </View>
    )
  }
}

function mapStateToProps(state: RootState): StateProps {
  const statusText = `${initializationSelectors.initializationDescription(
    state.initialization
  )}...`
  return {
    initialized: initializationSelectors.initialized(state.initialization),
    statusText,
    error: state.initialization.instance.error
  }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
  return {
    initialize: () => dispatch(initializationActions.initializeNewAccount())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InitializeNew)
