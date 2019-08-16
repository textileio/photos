import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  Text,
  ViewStyle,
  TextStyle,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native'
import Icon from '@textile/react-native-icon'

import Button from '../../Components/SmallButton'
import Loading from '../../Components/Loading'
import { RootAction, RootState } from '../../Redux/Types'
import {
  initializationActions,
  initializationSelectors
} from '../../features/initialization'
import { color, textStyle, spacing, size, fontFamily } from '../../styles'

import { wrapOnboarding } from './WrapOnboarding'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-start',
  padding: spacing._016,
  backgroundColor: color.screen_primary
}

const INNER_CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-evenly'
}

const ITEM: ViewStyle = {
  marginBottom: spacing._016
}

const TITLE: TextStyle = {
  ...ITEM,
  ...textStyle.header_l
}

const STATUS_CONTAINER: ViewStyle = {
  justifyContent: 'center',
  backgroundColor: color.screen_primary
}

const TEXT: TextStyle = {
  ...textStyle.body_m,
  textAlign: 'center',
  marginTop: spacing._012
}

const TEXT_INPUT: TextStyle = {
  ...textStyle.body_l,
  flex: 1,
  color: color.grey_2,
  borderBottomColor: color.grey_4,
  borderBottomWidth: 1,
  marginRight: spacing._016,
  marginBottom: spacing._004
}

const ERROR: TextStyle = {
  ...TEXT,
  color: color.severe_3
}

const SUCCESS: TextStyle = {
  ...TEXT,
  color: color.grey_4
}

const BUTTON: ViewStyle = {
  alignSelf: 'center',
  backgroundColor: color.action_3
}

const BUTTON_TEXT: TextStyle = {
  color: color.screen_primary
}

interface OwnProps {
  onSuccess?: () => void
}

interface StateProps {
  statusText: string
  processing: boolean
  initialized: boolean
  error?: string
}

interface DispatchProps {
  initialize: (seed: string) => void
}

interface State {
  seed?: string
  valid: boolean
}

type Props = OwnProps & StateProps & DispatchProps

class InitializeExisting extends React.Component<Props, State> {
  static successComponent() {
    return (
      <View style={STATUS_CONTAINER}>
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

  constructor(props: Props) {
    super(props)
    this.state = {
      valid: false
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.initialized !== prevProps.initialized) {
      // done initializing
      setTimeout(() => {
        if (this.props.onSuccess) {
          this.props.onSuccess()
        }
      }, 2500)
    }
  }

  updateText = (seed?: string) => {
    const valid = this.setState({ seed, valid: seed ? seed.length > 0 : false })
  }

  submit = () => {
    if (this.state.seed) {
      this.props.initialize(this.state.seed)
    }
  }

  errorComponent() {
    return (
      <View style={STATUS_CONTAINER}>
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
      element = InitializeExisting.successComponent()
    } else {
      const opacity = this.props.processing ? 1 : 0
      element = (
        <Loading
          text={this.props.statusText}
          containerxStyle={{ opacity, flex: 0 }}
        />
      )
    }
    return (
      <View style={CONTAINER}>
        <Text style={TITLE}>Sync Existing Account</Text>
        <View style={INNER_CONTAINER}>
          {element}
          <View>
            <View style={{ ...ITEM, flexDirection: 'row' }}>
              <TextInput
                style={TEXT_INPUT}
                placeholder="Account seed..."
                onChangeText={this.updateText}
              />
              <TouchableOpacity>
                <Icon name="scan" size={24} color={color.grey_4} />
              </TouchableOpacity>
            </View>
            <Button
              style={BUTTON}
              textStyle={BUTTON_TEXT}
              text="Submit"
              disabled={
                !this.state.valid ||
                this.props.processing ||
                this.props.initialized
              }
              onPress={this.submit}
            />
          </View>
        </View>
      </View>
    )
  }
}

function mapStateToProps(state: RootState): StateProps {
  const statusText = `${initializationSelectors.initializationDescription(
    state.initialization
  )}...`
  return {
    processing: initializationSelectors.processing(state.initialization),
    initialized: initializationSelectors.initialized(state.initialization),
    statusText,
    error: state.initialization.instance.error
  }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
  return {
    initialize: (seed: string) =>
      dispatch(initializationActions.initializeExistingAccount(seed))
  }
}

function isInitializeExistingAccountComplete(props: Props): boolean {
  return false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(wrapOnboarding(InitializeExisting, isInitializeExistingAccountComplete))
