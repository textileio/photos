import React from 'react'
import { SafeAreaView, View, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { NavigationScreenProps } from 'react-navigation'

import { RootAction, RootState } from '../../Redux/Types'

import Initialize from './initialize'
import InitializeNew from './initialize-new'
import InitializeExisting from './initialize-existing'
import OnboardingUsername from './OnboardingUsername'
import AvatarOnboarding from './AvatarOnboarding'
import MailListSignupScreen from './MailListSignupScreen'
import ChooseCafe from './ChooseCafe'
import { color, spacing } from '../../styles'
import { setCurrentPage } from '../../features/initialization/actions'

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
  completedPages: boolean[]
  currentPage: number
}

const Pages = [
  {
    page: Initialize,
    props: {}
  }
]

class Onboarding extends React.Component<Props, State> {
  pages: JSX.Element[]

  constructor(props: Props) {
    super(props)
    this.state = {
      completedPages: new Array<boolean>(Pages.length).fill(false),
      currentPage: 0
    }
    this.pages = Pages.map((pageData, index) => {
      const completed = () => {
        const completedPages = this.state.completedPages.slice()
        completedPages[index] = true
        this.setState({
          completedPages
        })
      }
      return (
        <pageData.page key={index} completed={completed} {...pageData.props} />
      )
    })
  }

  componentDidUpdate() {
    // The current page is the first page that isn't completed
    let currentPage = 0
    while (currentPage < this.state.completedPages.length) {
      if (this.state.completedPages[currentPage]) {
        currentPage++
      } else {
        break
      }
    }
    if (currentPage === this.state.completedPages.length) {
      // If all of the pages are completed, navigate away from onboarding
      this.props.navigation.navigate('PrimaryNav')
    } else if (currentPage !== this.state.currentPage) {
      // Otherwise, set current page to be the first uncompleted page in the list
      this.setState({
        currentPage
      })
    }
  }

  render() {
    return (
      <SafeAreaView style={CONTAINER}>
        <View style={CONTAINER}>
          <View style={[CONTAINER, { marginBottom: spacing._016 }]}>
            {this.pages[this.state.currentPage]}
          </View>
          <ProgressBar
            length={this.pages.length}
            active={this.state.currentPage}
          />
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
