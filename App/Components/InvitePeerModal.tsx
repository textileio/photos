import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux/index'
import {
  View,
  Text
} from 'react-native'
import Modal from 'react-native-modal'

import ModalButtons from './ModalButtons'
import { CreateThreadComponent } from './CreateThreadModal'

import { RootAction, RootState } from '../Redux/Types'
import { ThreadId, ThreadName } from '../Models/TextileTypes'
import PhotoViewingActions, { ThreadData } from '../Redux/PhotoViewingRedux'
import PreferencesActions, { TourScreens } from '../Redux/PreferencesRedux'
import UIActions from '../Redux/UIRedux'
import { getThreads } from '../Redux/PhotoViewingSelectors'

import { ThreadSelectComponent } from '../SB/components/ThreadSelect'
import { ThreadsEditFriendsComponent } from '../SB/views/ThreadsEditFriends'

// Styles
import styles from './Styles/InvitePeerModalStyles'

interface DispatchProps {
  completeScreen: (threadName: string) => void
  refreshContacts: () => void
  submit: (name: string, navigate: boolean, selectToShare: boolean) => void
}

interface ScreenProps {
  isVisible: boolean
  cancel: () => void
}

class InvitePeerModal extends React.Component<DispatchProps & StateProps & ScreenProps> {
  state = {
    submitted: false,
    showCreateThreadModal: false,
    threadId: undefined,
    threadName: undefined,
    threadSelected: false
  }

  openThreadModal () {
    return () => {
      this.setState({showCreateThreadModal: true, threadId: undefined, threadName: undefined})
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

  selectThread () {
    return (threadId: ThreadId) => {
      const thread = this.props.threads.find((t) => t.id === threadId)
      const threadName = thread ? thread.name : 'thread'
      this.setState({threadId, threadName})
    }
  }

  cancel () {
    return () => {
      this.props.cancel()
    }
  }

  continue () {
    return () => {
      this.props.refreshContacts()
      this.setState({threadSelected: true})
    }
  }

  cancelPeerRequest () {
    return () => {
      this.setState({
        threadId: undefined,
        threadName: undefined,
        threadSelected: false
      })
      this.props.cancel()
    }
  }

  renderThreadSelect () {
    return (
      <View style={styles.content}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Invite New Peer</Text>
          <Text style={styles.subTitleText}>First select a Thread to share with peer.</Text>
        </View>
        <View style={styles.body}>
          <ThreadSelectComponent
            createNew={this.openThreadModal()}
            select={this.selectThread()}
            threads={this.props.threads}
            selected={this.state.threadId}
          />
        </View>
        <View style={styles.buttons}>
          <ModalButtons
            continueEnabled={this.state.threadId !== undefined}
            continue={this.continue()}
            cancel={this.cancel()}
          />
        </View>
      </View>
    )
  }

  renderPeerSelect () {
    return (
      <ThreadsEditFriendsComponent
        threadId={this.state.threadId}
        threadName={this.state.threadName}
        cancel={this.cancelPeerRequest()}
      />
    )
  }

  renderCreateThread () {
    return (
      <CreateThreadComponent
        fullScreen={true}
        selectToShare={true}
        navigateTo={false}
        cancel={this.cancelCreateThread()}
        complete={this.completeCreateThread()}
      />
    )
  }

  renderBody () {
    if (this.state.showCreateThreadModal) {
      return this.renderCreateThread()
    } else if (this.state.threadSelected) {
      return this.renderPeerSelect()
    }
    return this.renderThreadSelect()
  }

  render () {
    return (
      <Modal
        isVisible={this.props.isVisible}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard={true}
        backdropOpacity={1}
        style={styles.modal}
      >
        {this.renderBody()}
      </Modal>
    )
  }
}

interface StateProps {
  threads: ThreadData[]
}

const mapStateToProps = (state: RootState): StateProps  => {

  const allThreads = getThreads(state)
  let threads: ThreadData[] = []
  const defaultThreadName: ThreadName = 'default' as any
  if (allThreads.length > 0) {
    threads = allThreads
      .filter((thread: ThreadData) => thread.name !== defaultThreadName)
      .sort((a, b) => {
        if (a.name === null || a.name === '') {
          return 1
        } else if (b.name === null || b.name === '') {
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
  }

  return {
    threads
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    completeScreen: () => { dispatch(PreferencesActions.completeTourSuccess('threadsManager' as TourScreens)) },
    refreshContacts: () => { dispatch(UIActions.refreshContacts()) },
    submit: (name, navigate, selectToShare) => { dispatch(PhotoViewingActions.addThreadRequest(name, { navigate, selectToShare })) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitePeerModal)
