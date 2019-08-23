import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import Toast from 'react-native-easy-toast'
import Modal from 'react-native-modal'

import ModalButtons from '../../../Components/ModalButtons'
import ContactSelect, { IncludedContact } from '../../components/ContactSelect'
import QRCodeModal from '../../../Components/QRCodeModal'
import ThreadsActions, { InviteQRCode } from '../../../Redux/ThreadsRedux'
import { RootState, RootAction } from '../../../Redux/Types'

import styles from './statics/styles'
import { IContact } from '@textile/react-native-sdk'

interface ScreenProps {
  threadId: string
  threadName: string
  cancel: () => void
  isVisible?: boolean
}

interface State {
  selected: { [key: string]: boolean }
  showQrCode: boolean
}

type Props = DispatchProps & StateProps & ScreenProps

class Component extends React.Component<Props> {
  state: State = {
    selected: {},
    showQrCode: false
  }

  getPublicLink = () => {
    // Generate a link dialog
    this.props.invite(this.props.threadId, this.props.threadName)
  }

  findNearby = () => {
    // @ts-ignore
    this.refs.toast.show('Please enable Airdrop', 1600)
    // Generate a link dialog
    this.props.invite(this.props.threadId, this.props.threadName)
  }

  copyToClipboard = () => {
    // Copy link to clipboard
    this.props.invite(this.props.threadId, this.props.threadName, 'clipboard')
    // @ts-ignore
    this.refs.toast.show('Success', 1200)
  }

  displayThreadQRCode = () => {
    // Generate a link dialog
    this.props.threadQRCodeRequest(this.props.threadId, this.props.threadName)
    this.setState({ showQrCode: true })
  }

  _hideQRCode() {
    return () => {
      this.setState({ showQrCode: false })
    }
  }

  _select(contact: IContact, included: boolean) {
    // Toggle the id's selected state in state
    if (included) {
      return // if the user is already part of the thread
    }
    const state = !this.state.selected[contact.address]
    this.setState({
      selected: { ...this.state.selected, [contact.address]: state }
    })
  }

  getSelected() {
    return Object.keys(this.state.selected).filter(
      id => this.state.selected[id] === true
    )
  }

  _updateThread() {
    const selected = this.getSelected()

    // grab the Pks from the user Ids
    const addresses: string[] = selected
      .map(address => {
        const existing = this.props.contacts.find(
          ctc => ctc.address === address
        )
        if (existing) {
          return existing.address
        }
        return ''
      })
      .filter(id => id !== '')

    if (addresses.length === 0) {
      // @todo -- fix all this.refs so that typescript can introspect the types correctly
      // @ts-ignore
      this.refs.toast.show('No contacts selected.', 1500)
      return
    }
    // @ts-ignore
    this.refs.toast.show('Success! Your invite(s) were sent.', 2400)
    this.props.addInternalInvites(this.props.threadId, addresses)
    setTimeout(() => {
      this.props.cancel()
    }, 2400)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, zIndex: 10 }}>
          <ContactSelect
            findNearby={this.findNearby}
            copyToClipboard={this.copyToClipboard}
            displayQRCode={this.displayThreadQRCode}
            getPublicLink={this.getPublicLink}
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
          /* tslint:disable-next-line jsx-no-bind */
          continue={this._updateThread.bind(this)}
          cancel={this.props.cancel}
          continueText={'Send'}
          cancelText={'Exit'}
          style={styles.bottomRow}
        />
        <QRCodeModal
          isVisible={this.state.showQrCode}
          invite={this.props.qrCodeInvite}
          cancel={this._hideQRCode()}
        />
        <Toast
          /* tslint:disable-next-line jsx-no-string-ref */
          ref="toast"
          position="top"
          fadeInDuration={50}
          style={styles.toast}
          textStyle={styles.toastText}
        />
      </View>
    )
  }
}

interface StateProps {
  topFive: IncludedContact[]
  // puts a placeholder row in contacts for adding external invite link
  contacts: IncludedContact[]
  notInThread: boolean
  qrCodeInvite?: InviteQRCode
}

const mapStateToProps = (
  state: RootState,
  ownProps: ScreenProps
): StateProps => {
  const threadId = ownProps.threadId
  const contacts = state.contacts.contacts
    .map(contact => {
      return {
        ...contact,
        type: 'contact',
        included: (contact.threads || []).indexOf(threadId) >= 0
      }
    })
    .filter(contact => contact.name !== '' && contact.name !== undefined)

  const notInThread = contacts.filter(c => !c.included)
  const popularity = notInThread.sort(
    (a, b) => (b.threads || []).length - (a.threads || []).length
  )
  const topFive = popularity.slice(0, 5)
  const sortedContacts = contacts.sort((a, b) => {
    if (!a.name || a.name === '') {
      return 1
    } else if (!b.name || b.name === '') {
      return -1
    }
    const A = a.name.toString().toUpperCase()
    const B = b.name.toString().toUpperCase()
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
    notInThread: Boolean(notInThread.length),
    qrCodeInvite:
      state.threads.qrCodeInvite && state.threads.qrCodeInvite.id === threadId
        ? state.threads.qrCodeInvite
        : undefined
  }
}

interface DispatchProps {
  invite: (threadId: string, threadName: string, target?: string) => void
  threadQRCodeRequest: (threadId: string, threadName: string) => void
  addInternalInvites: (threadId: string, inviteePks: string[]) => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  invite: (threadId: string, threadName: string, target?: string) => {
    dispatch(ThreadsActions.addExternalInviteRequest(threadId, threadName, target))
  },
  threadQRCodeRequest: (threadId: string, threadName: string) => {
    dispatch(ThreadsActions.threadQRCodeRequest(threadId, threadName))
  },
  addInternalInvites: (threadId: string, inviteePks: string[]) => {
    dispatch(ThreadsActions.addInternalInvitesRequest(threadId, inviteePks))
  }
})

export const ThreadsEditFriendsComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)

export default class ThreadsEditFriends extends React.Component<ScreenProps> {
  render() {
    return (
      <Modal
        isVisible={Boolean(this.props.isVisible)}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard={true}
        backdropOpacity={0.5}
        style={{ margin: 0, padding: 0 }}
      >
        <ThreadsEditFriendsComponent {...this.props} />
      </Modal>
    )
  }
}
