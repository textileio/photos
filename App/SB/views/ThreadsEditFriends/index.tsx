import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import Toast from 'react-native-easy-toast'
import Modal from 'react-native-modal'

import ModalButtons from '../../../Components/ModalButtons'
import ContactSelect from '../../components/ContactSelect'
import QRCodeModal from '../../../Components/QRCodeModal'
import ThreadsActions, { InviteQRCode } from '../../../Redux/ThreadsRedux'
import { RootState, RootAction } from '../../../Redux/Types'

import styles from './statics/styles'
import { pb } from '@textile/react-native-sdk'

interface ScreenProps {
  threadId: string
  threadName: string
  cancel: () => void
  isVisible?: boolean
}

interface State {
  selected: {[key: string]: boolean}
  showQrCode: boolean
}

type Props = DispatchProps & StateProps & ScreenProps

class Component extends React.Component<Props> {
  state: State = {
    selected: {},
    showQrCode: false
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

  _select (contact: pb.IContact, included: boolean) {
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

    // grab the Pks from the user Ids
    const ids: string[] = selected.map((id) => {
      const existing = this.props.contacts.find((ctc) => ctc.id === id)
      if (existing) {
        return existing.id
      }
      return ''
    })
    .filter((id) => id !== '')

    if (ids.length === 0) {
      // @ts-ignore
      this.refs.toast.show('No contacts selected.', 1500)
      return
    }
    // @ts-ignore
    this.refs.toast.show('Success! Your invite(s) were sent.', 2400)
    this.props.addInternalInvites(this.props.threadId, ids)
    setTimeout(() => { this.props.cancel() }, 2400)
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, zIndex: 10}}>
          <ContactSelect
            /* tslint:disable-next-line jsx-no-bind */
            displayQRCode={this._displayThreadQRCode.bind(this)}
            /* tslint:disable-next-line jsx-no-bind */
            getPublicLink={this._getPublicLink.bind(this)}
            contacts={this.props.contacts}
            /* tslint:disable-next-line jsx-no-bind */
            select={this._select.bind(this)}
            selected={this.state.selected}
            topFive={this.props.topFive}
            notInThread={this.props.notInThread}
            threadName={this.props.threadName}
          />
        </View>
        <ModalButtons
          continueEnabled={this.getSelected().length > 0}
          /* tslint:disable-next-line jsx-no-bind */
          continue={this._updateThread.bind(this)}
          cancel={this.props.cancel}
          continueText={'Send'}
          cancelText={'Exit'}
          style={styles.bottomRow}
        />
        <QRCodeModal isVisible={this.state.showQrCode} invite={this.props.qrCodeInvite} cancel={this._hideQRCode()} />
        <Toast
          /* tslint:disable-next-line jsx-no-string-ref */
          ref='toast'
          position='top'
          fadeInDuration={50}
          style={styles.toast}
          textStyle={styles.toastText}
        />
      </View>
    )
  }
}

interface StateProps {
  topFive: ReadonlyArray<pb.IContact>,
  // puts a placeholder row in contacts for adding external invite link
  contacts: ReadonlyArray<pb.IContact>,
  notInThread: boolean,
  qrCodeInvite?: InviteQRCode
}

const mapStateToProps = (state: RootState, ownProps: ScreenProps): StateProps  => {
  const threadId = ownProps.threadId
  const contacts = state.contacts.contacts
    .map((contact) => {
      return {
        ...contact,
        type: 'contact',
        included: (contact.threads || []).indexOf(threadId) >= 0
      }
    })
    .filter((contact) => contact.username !== '' && contact.username !== undefined)

  const notInThread = contacts.filter((c) => !c.included)
  const popularity = notInThread.sort((a, b) => (b.threads || []).length - (a.threads || []).length)
  const topFive = popularity.slice(0, 5)
  const sortedContacts = contacts.sort((a, b) => {
    if (!a.username || a.username === '') {
      return 1
    } else if (!b.username || b.username === '') {
      return -1
    }
    const A = a.username.toString().toUpperCase()
    const B = b.username.toString().toUpperCase()
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
    notInThread: !!notInThread.length,
    qrCodeInvite: (state.threads.qrCodeInvite && state.threads.qrCodeInvite.id === threadId) ? state.threads.qrCodeInvite : undefined
  }
}

interface DispatchProps {
  invite: (threadId: string, threadName: string) => void
  threadQRCodeRequest: (threadId: string, threadName: string) => void
  addInternalInvites: (threadId: string, inviteePks: string[]) => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  invite: (threadId: string, threadName: string) => { dispatch(ThreadsActions.addExternalInviteRequest(threadId, threadName)) },
  threadQRCodeRequest: (threadId: string, threadName: string) => { dispatch(ThreadsActions.threadQRCodeRequest(threadId, threadName)) },
  addInternalInvites: (threadId: string, inviteePks: string[]) => { dispatch(ThreadsActions.addInternalInvitesRequest(threadId, inviteePks)) }
})

export const ThreadsEditFriendsComponent = connect(mapStateToProps, mapDispatchToProps)(Component)

export default class ThreadsEditFriends extends React.Component<ScreenProps> {
  render () {
    return (
      <Modal
        isVisible={!!this.props.isVisible}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard={true}
        backdropOpacity={0.5}
        style={{margin: 0, padding: 0}}
      >
        <ThreadsEditFriendsComponent {...this.props}/>
      </Modal>
    )
  }
}
