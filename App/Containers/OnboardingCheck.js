import React, { Component } from 'react'
import { ActivityIndicator, StatusBar, View } from 'react-native'
import { connect } from 'react-redux'

class OnboardingCheck extends Component {
  constructor (props) {
    super(props)
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(this.props.onboarded ? 'PhotosNavigation' : 'OnboardingNavigation')
  }
  render () {
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator />
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {onboarded: state.textile.onboarded}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingCheck)
