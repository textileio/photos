import React from 'react'
import { SafeAreaView, ViewStyle, View, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Pages } from 'react-native-pages'

import MigrationScreen from './MigrationScreen'
import { color, spacing } from '../../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

interface State {
  currentPage: number
}

export default class MigrationContainer extends React.Component<NavigationScreenProps, State> {

  pages?: Pages

  constructor(props: NavigationScreenProps) {
    super(props)
    this.state = {
      currentPage: 0
    }
  }

  complete = () => {
    this.props.navigation.navigate('StatusCheck')
  }

  nextPage = () => {
    if (this.pages && this.pages.props.children.length - 1 > this.state.currentPage) {
      this.pages.scrollToPage(this.state.currentPage + 1)
    }
  }

  previousPage = () => {
    if (this.state.currentPage > 0) {
      this.pages.scrollToPage(this.state.currentPage - 1)
    }
  }

  onScrollEnd = (index: number) => {
    this.setState({ currentPage: index })
  }

  render() {
    return (
      <SafeAreaView style={CONTAINER}>
        <Pages
          ref={(pages: any) => { this.pages = pages ? pages : undefined }}
          style={[CONTAINER]}
          containerStyle={{ marginBottom: spacing._016 }}
          indicatorColor={color.accent2_2}
          onScrollEnd={this.onScrollEnd}
          startPage={this.state.currentPage}
          scrollEnabled={false}
        >
          <MigrationScreen onSuccess={this.complete}/>
        </Pages>
      </SafeAreaView>
    )
  }
}
