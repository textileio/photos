import React, { Component } from 'react'
import { View, StatusBar, ActivityIndicator } from 'react-native'
import { Overlay } from 'react-native-elements'
import AppNavigation from '../Navigation/AppNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'
import NavigationService from '../Services/NavigationService'

// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {
  componentDidMount () {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
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

const mapStateToProps = (state) => {
  return {
    showOverlay: state.auth.processing
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
