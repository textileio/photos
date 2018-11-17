import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import Toast from 'react-native-easy-toast'
import Modal from 'react-native-modal'

import ModalButtons from '../../../Components/ModalButtons'
import ContactSelect from '../../components/ContactSelect'
import QRCodeModal from '../../../Components/QRCodeModal'
import ThreadsActions from '../../../Redux/ThreadsRedux'

import styles from './statics/styles'

class Component extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      selected: {},
      showQrCode: false
    }
  }

  _getPublicLink () {
    // Generate a link dialog
    this.props.invite(
      this.props.threadId,
      this.props.threadName
    )
  }

  _displayThreadQRCode () {
    // Generate a link dialog
    this.props.threadQRCodeRequest(
      this.props.threadId,
      this.props.threadName
    )
    this.setState({showQrCode: true})
  }

  _hideQRCode () {
    return () => {
      this.setState({showQrCode: false})
    }
  }

  _select (contact, included) {
    // Toggle the id's selected state in state
    if (included) {
      return // if the user is already part of the thread
    }
    const state = !this.state.selected[contact.id]
    this.setState({
      selected: { ...this.state.selected, [contact.id]: state }
    })
  }

  getSelected () {
    return Object.keys(this.state.selected).filter((id) => this.state.selected[id] === true)
  }

  _updateThread () {
    const selected = this.getSelected()
    if (selected.length === 0) {
      return
    }
    // grab the Pks from the user Ids
    const inviteePks = selected.map((id) => {
      const existing = this.props.contacts.find((ctc) => ctc.id === id)
      return existing.pk
    })

    if (inviteePks.length === 0) {
      this.refs.toast.show('Select a peer first.', 1500)
      return
    }

    this.refs.toast.show('Success! The peer list will not update until your invitees accept.', 2400)
    this.props.addInternalInvites(this.props.threadId, inviteePks)
    setTimeout(() => { this.props.cancel() }, 2400)
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, zIndex: 10}}>
          <ContactSelect
            displayQRCode={this._displayThreadQRCode.bind(this)}
            getPublicLink={this._getPublicLink.bind(this)}
            contacts={this.props.contacts}
            select={this._select.bind(this)}
            selected={this.state.selected}
            topFive={this.props.topFive}
            notInThread={this.props.notInThread}
            threadName={this.props.threadName}
          />
        </View>
        <ModalButtons
          continueEnabled={this.getSelected().length > 0}
          continue={this._updateThread}
          cancel={this.props.cancel}
          continueText={'Send'}
          cancelText={'Exit'}
          style={styles.bottomRow}
        />
        <QRCodeModal isVisible={this.state.showQrCode} invite={this.props.qrCodeInvite} cancel={this._hideQRCode()} />
        <Toast ref='toast' position='top' fadeInDuration={50} style={styles.toast} textStyle={styles.toastText} />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const threadId = ownProps.threadId
  const contacts = state.contacts.contacts
    .map((contact) => {
      return {
        ...contact,
        type: 'contact',
        included: contact.thread_ids.includes(threadId)
      }
    })
    .filter(c => c.username !== '' && c.username !== undefined)

  const notInThread = contacts.filter(c => !c.included)
  const popularity = notInThread.sort((a, b) => b.thread_ids.length - a.thread_ids.length)
  const topFive = popularity.slice(0, 5)
  const sortedContacts = contacts.sort((a, b) => {
    if (a.username === null || a.username === '') {
      return 1
    } else if (b.username === null || b.username === '') {
      return -1
    }
    let A = a.username.toString().toUpperCase()
    let B = b.username.toString().toUpperCase()
    if (A === B) {
      return 0
    } else {
      return A < B ? -1 : 1
    }
  })

  return {
    topFive,
    // puts a placeholder row in contacts for adding external invite link
    contacts: sortedContacts,
    notInThread: notInThread.length,
    qrCodeInvite: state.threads.qrCodeInvite && state.threads.qrCodeInvite.id === threadId && state.threads.qrCodeInvite
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    invite: (threadId, threadName) => { dispatch(ThreadsActions.addExternalInviteRequest(threadId, threadName)) },
    threadQRCodeRequest: (threadId, threadName) => { dispatch(ThreadsActions.threadQRCodeRequest(threadId, threadName)) },
    addInternalInvites: (threadId, inviteePks) => { dispatch(ThreadsActions.addInternalInvitesRequest(threadId, inviteePks)) }
  }
}

export const ThreadsEditFriendsComponent = connect(mapStateToProps, mapDispatchToProps)(Component)

export default class ThreadsEditFriends extends React.PureComponent {
  render () {
    return (
      <Modal
        isVisible={this.props.isVisible}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard={true}
        backdropOpacity={0.5}
        style={{margin: 0, padding: 0}}
      >
        <ThreadsEditFriendsComponent {...this.props} />
      </Modal>
    )
  }
}
