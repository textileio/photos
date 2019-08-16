import React from 'react'
import { SafeAreaView, View, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { NavigationScreenProps } from 'react-navigation'

import { RootAction, RootState } from '../../Redux/Types'

import InitializeNew from './initialize-new'
import OnboardingUsername from './OnboardingUsername'
import AvatarOnboarding from './AvatarOnboarding'
import MailListSignupScreen from './MailListSignupScreen'
import ChooseCafe from './ChooseCafe'
import { color, spacing } from '../../styles'

// Styles

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

const PROGRESS_BAR: ViewStyle = {
  height: 60,
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
}

const DOT: ViewStyle = {
  margin: 3,
  height: 8,
  width: 8,
  backgroundColor: color.action_6,
  borderRadius: 4
}

const DOT_ACTIVE: ViewStyle = {
  backgroundColor: color.action_4
}

// Components

// Individual dot displayed at bottom of screen. Is highlighted when active.
interface DotProps {
  active: boolean
}

const Dot = (props: DotProps) => {
  return <View style={[DOT, props.active && DOT_ACTIVE]} />
}

interface ProgressBarProps {
  length: number
  active: number
}

// List of dots displayed at the bottom of the screen as a progress bar
const ProgressBar = (props: ProgressBarProps) => {
  return (
    <View style={PROGRESS_BAR}>
      {[...Array(props.length).keys()].map(i => {
        return <Dot key={i} active={i === props.active} />
      })}
    </View>
  )
}

interface StateProps {}

interface DispatchProps {}

type Props = StateProps & DispatchProps & NavigationScreenProps

interface State {
  pagesCompleted: boolean[]
}

class Onboarding extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      pagesCompleted: []
    }
  }

  render() {
    return (
      <SafeAreaView style={CONTAINER}>
        <View style={CONTAINER}>
          <View style={[CONTAINER, { marginBottom: spacing._016 }]} />
          <ProgressBar length={0} active={0} />
        </View>
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state: RootState): StateProps {
  return {}
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Onboarding)
