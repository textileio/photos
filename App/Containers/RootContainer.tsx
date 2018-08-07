import React, { Component } from 'react'
import { View, StatusBar, ActivityIndicator } from 'react-native'
import { Overlay } from 'react-native-elements'
import AppNavigation from '../Navigation/AppNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'
import NavigationService from '../Services/NavigationService'
import { RootState } from '../Redux/Types'

// Styles
import styles from './Styles/RootContainerStyles'

type Props = {
  showOverlay: boolean
}

class RootContainer extends Component<Props> {
  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='dark-content' />
        <AppNavigation ref={navRef => { NavigationService.setTopLevelNavigator(navRef) }} />
        <Overlay
          isVisible={this.props.showOverlay}
          windowBackgroundColor='rgba(0, 0, 0, .1)'
          overlayBackgroundColor='rgba(0, 0, 0, .8)'
          borderRadius={8}
          width='auto'
          height='auto'
        >
          <ActivityIndicator size='large' color='#ffffff' />
        </Overlay>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    showOverlay: state.auth.processing
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
