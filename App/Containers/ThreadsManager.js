import React from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { View, Text, Image } from 'react-native'
import { Item } from 'react-navigation-header-buttons'

import Icons from '../Components/Icons'
import { TextileHeaderButtons } from '../Components/HeaderButtons'
import CreateThreadModal from '../Components/CreateThreadModal'

import ThreadSelector from '../Components/ThreadSelector'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import { getThreads } from '../Redux/PhotoViewingSelectors'

import styles from '../SB/views/ThreadsList/statics/styles'
import onboardingStyles from './Styles/OnboardingStyle'

class ThreadsManager extends React.PureComponent {

  state = {
    showCreateThreadModal: false
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const headerLeft = (
      <TextileHeaderButtons left>
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
      </TextileHeaderButtons>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <Item title='Add Thread' iconName='player-list-add' onPress={params.openThreadModal} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Threads',
      headerRight
    }
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
      this.setState({showCreateThreadModal: true})
    }
  }

  cancelCreateThread () {
    return () => {
      this.setState({showCreateThreadModal: false})
    }
  }

  completeCreateThread () {
    return () => {
      this.setState({showCreateThreadModal: false})
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
          your Threads - private groups
          where you can share photos with your
          friends and family.
        </Text>
        <Text style={onboardingStyles.emptyStateText}>
          Click the <Icons name='plus' size={24} color='black' /> button above to create your first Thread.
        </Text>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        {this.props.showOnboarding && this._renderOnboarding()}
        {!this.props.showOnboarding && <ThreadSelector threads={this.props.threads} createNewThread={this.openThreadModal()}/>}
        <CreateThreadModal
          isVisible={this.state.showCreateThreadModal}
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

const mapStateToProps = (state) => {
  const allThreads = getThreads(state)
  let threads
  if (allThreads.length > 0) {
    threads = allThreads
      .filter(thread => thread.name !== 'default')
      .map(thread => {
        return {
          id: thread.id,
          name: thread.name,
          // total number of images in the thread
          size: thread.photos.length,
          // just keep the top 2
          photos: thread.photos.slice(0, 3),
          // get a rough count of distinct users
          userCount: thread.photos.length > 0 ? [...new Set(thread.photos.map(photo => photo.author_id))].length : 1,
          // latest update based on the latest item
          updated: thread.photos.length > 0 && thread.photos[0].date ? Date.parse(thread.photos[0].date) : 0,
          // latest peer to push to the thread
          latestPeerId: thread.photos.length > 0 && thread.photos[0].author_id ? thread.photos[0].author_id : undefined
        }
      })
      .sort((a, b) => a.updated < b.updated)
  }

  return {
    threads
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewThread: (threadId) => { dispatch(PhotoViewingActions.viewThread(threadId)) },
    refreshMessages: () => { dispatch(TextileNodeActions.refreshMessagesRequest()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsManager)
