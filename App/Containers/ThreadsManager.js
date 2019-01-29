import React from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { View, Text, Image } from 'react-native'
import { Item } from 'react-navigation-header-buttons'
import Icon from '@textile/react-native-icon'

import { TextileHeaderButtons } from '../Components/HeaderButtons'
import CreateThreadModal from '../Components/CreateThreadModal'

import ThreadSelector from '../Components/ThreadSelector'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import MockBridgeActions from '../Redux/MockBridge'

import styles from '../SB/views/ThreadsList/statics/styles'
import onboardingStyles from './Styles/OnboardingStyle'

class ThreadsManager extends React.PureComponent {

  state = {
    showCreateGroupModal: false
  }

  componentWillMount () {
    // refresh our messages
    this.props.refreshMessages()
  }

  componentDidMount () {
    this.props.navigation.setParams({
      online: this.props.online,
      openThreadModal: this.openThreadModal()
    })
  }

  componentDidUpdate (prevProps, prevState, ss) {
    if (
      this.props.online !== prevProps.online
    ) {
      this.props.navigation.setParams({
        online: this.props.online
      })
    }
  }

  openThreadModal () {
    return () => {
      this.setState({showCreateGroupModal: true})
    }
  }

  cancelCreateThread () {
    return () => {
      this.setState({showCreateGroupModal: false})
    }
  }

  completeCreateThread () {
    return () => {
      this.setState({showCreateGroupModal: false})
    }
  }

  _renderOnboarding () {
    return (
      <View style={onboardingStyles.emptyStateContainer}>
        <Image
          style={onboardingStyles.emptyStateImage}
          source={require('../Images/v2/party.png')} />
        <Text style={onboardingStyles.emptyStateText}>
          This is where you can manage
          your private Groups - where
          you can share photos with your
          friends and family.
        </Text>
        <Text style={onboardingStyles.emptyStateText}>
          Click the <Icon name='plus' size={24} color='black' /> button above to create your first Group.
        </Text>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        {this.props.showOnboarding && this._renderOnboarding()}
        {!this.props.showOnboarding && <ThreadSelector createNewThread={this.openThreadModal()}/>}
        <CreateThreadModal
          isVisible={this.state.showCreateGroupModal}
          fullScreen={false}
          selectToShare={false}
          navigateTo={true}
          cancel={this.cancelCreateThread()}
          complete={this.completeCreateThread()}
        />
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewThread: (threadId) => { dispatch(PhotoViewingActions.viewThread(threadId)) },
    refreshMessages: () => { dispatch(MockBridgeActions.refreshMessagesRequest()) }
  }
}

export default connect(undefined, mapDispatchToProps)(ThreadsManager)
