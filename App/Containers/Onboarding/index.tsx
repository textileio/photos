import React from 'react'
import { SafeAreaView, View, ViewStyle } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import ProgressBar from './OnboardingProgressBar'

import InitializeNew from './initialize-new'
import InitializeExisting from './initialize-existing'
import OnboardingUsername from './OnboardingUsername'
import AvatarOnboarding from './AvatarOnboarding'
import ChooseCafe from './ChooseCafe'
import { color, spacing } from '../../styles'

// Styles

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

type Props = NavigationScreenProps

interface State {
  completedPages: boolean[]
  currentPage: number
}

const Pages = [
  InitializeExisting,
  InitializeNew,
  OnboardingUsername,
  AvatarOnboarding,
  ChooseCafe
]

interface EnrichedChildren {
  onChange(): void
  selectedValue: string
  name: string
  children?: React.ReactNode
}

export default class Onboarding extends React.Component<Props, State> {
  pages: JSX.Element[]

  constructor(props: Props) {
    super(props)
    this.state = {
      completedPages: new Array<boolean>(Pages.length).fill(false),
      currentPage: 0
    }
    this.pages = Pages.map((Page, index) => {
      const completed = () => {
        const completedPages = this.state.completedPages.slice()
        completedPages[index] = true
        this.setState({
          completedPages
        })
      }
      return React.createElement(Page, {
        key: index,
        completed
      })
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
