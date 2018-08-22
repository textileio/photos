import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import Toast from 'react-native-easy-toast'

import ContactSelect from '../../components/ContactSelect'
import ThreadsActions from '../../../Redux/ThreadsRedux'
import * as TextileTypes from '../../../Models/TextileTypes'
import { TextileHeaderButtons, Item } from '../../../Components/HeaderButtons'

import styles from './statics/styles'
import Config from 'react-native-config'

class ThreadsEditFriends extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      selected: {}
    }
  }

  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state
    const headerLeft = (
      <TextileHeaderButtons left>
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
      </TextileHeaderButtons>
    )

    const headerRight = params.updateEnabled && (
      <TextileHeaderButtons >
        <Item title='invite' onPress={() => {
          params.updateThread()
        }} />
      </TextileHeaderButtons>
    )

    return {
      headerRight,
      headerLeft
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      getPublicLink: this._getPublicLink.bind(this),
      updateThread: this._updateThread.bind(this),
      updateEnabled: this.props.topFive.length > 0
    })
  }

  _getPublicLink () {
    // Generate a link dialog
    this.props.invite(
      this.props.navigation.state.params.threadId,
      this.props.navigation.state.params.threadName
    )
  }

  _select (contact, included) {
    // Toggle the id's selected state in state
    if (included) return // if the user is already part of the thread
    const state = !this.state.selected[contact.id]
    this.setState({
      selected: {...this.state.selected, [contact.id]: state}
    })
  }

  _updateThread () {
    // grab the Pks from the user Ids
    const inviteePks = Object.keys(this.state.selected).filter((id) => this.state.selected[id] === true).map((id) => {
      const existing = this.props.contacts.find((ctc) => ctc.id === id)
      return existing.pk
    })

    if (inviteePks.length === 0) {
      this.refs.toast.show('Select a peer first.', 1500)
      return
    }

    this.refs.toast.show('Success! The peer list will not update until your invitees accept.', 2400)
    this.props.addInternalInvites(this.props.navigation.state.params.threadId, inviteePks)
    setTimeout(() => { this.props.navigation.dispatch(NavigationActions.back()) }, 2400)
  }

  render () {
    return (
      <View style={styles.container}>
        <ContactSelect
          getPublicLink={this._getPublicLink.bind(this)}
          contacts={this.props.contacts}
          select={this._select.bind(this)}
          selected={this.state.selected}
          topFive={this.props.topFive}
        />
        <Toast ref='toast' position='top' fadeInDuration={50} style={styles.toast} textStyle={styles.toastText} />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const contacts = state.contacts.contacts.map((contact): TextileTypes.Contact & {uri?: string, included: boolean} => {
    return {
      ...contact,
      uri: contact.id ? Config.TEXTILE_CAFE_URI + '/ipns/' + contact.id + '/avatar' : undefined,
      included: contact.thread_ids.includes(ownProps.navigation.state.params.threadId)
    }
  })
  const popularity = contacts.filter(c => !c.included).sort((a, b) => a.thread_ids.length < b.thread_ids.length)
  return {
    topFive: popularity.slice(0, 5),
    contacts: contacts.sort((a, b) => {
      if (a.username === null || a.username === '') {
        return 1
      } else if (b.username === null || b.username === '') {
        return -1
      } else if (a.username === b.username) {
        return 0
      } else {
        return a.username < b.username ? -1 : 1
      }
    })
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    invite: (threadId: string, threadName: string) => { dispatch(ThreadsActions.addExternalInviteRequest(threadId, threadName)) },
    addInternalInvites: (threadId: string, inviteePks: string[]) => { dispatch(ThreadsActions.addInternalInvitesRequest(threadId, inviteePks)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsEditFriends)
