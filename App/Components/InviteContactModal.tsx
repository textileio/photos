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
import PhotoViewingActions, { ThreadData } from '../Redux/PhotoViewingRedux'
import PreferencesActions, { TourScreens } from '../Redux/PreferencesRedux'
import ContactsActions from '../Redux/ContactsRedux'
import { getThreads } from '../Redux/PhotoViewingSelectors'

import { ThreadSelectComponent } from '../SB/components/ThreadSelect'
import { ThreadsEditFriendsComponent } from '../SB/views/ThreadsEditFriends'

// Styles
import styles from './Styles/InviteContactModalStyles'

interface DispatchProps {
  completeScreen: (threadName: string) => void
  refreshContacts: () => void
  submit: (name: string, navigate: boolean, selectToShare: boolean) => void
}

interface ScreenProps {
  isVisible: boolean
  cancel: () => void
}

interface State {
  submitted: boolean
  showCreateGroupModal: boolean
  threadId?: string,
  threadName?: string,
  threadSelected: boolean
}

class InviteContactModal extends React.Component<DispatchProps & StateProps & ScreenProps> {
  state: State = {
    submitted: false,
    showCreateGroupModal: false,
    threadSelected: false
  }

  openThreadModal () {
    return () => {
      this.setState({showCreateGroupModal: true, threadId: undefined, threadName: undefined})
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

  selectThread () {
    return (threadId: string) => {
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
          <Text style={styles.titleText}>Invite New Contact</Text>
          <Text style={styles.subTitleText}>Select a Group to add your new Contact.</Text>
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

  renderPeerSelect (threadId: string, threadName: string) {
    return (
      <ThreadsEditFriendsComponent
        threadId={threadId}
        threadName={threadName}
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
    if (this.state.showCreateGroupModal) {
      return this.renderCreateThread()
    } else if (this.state.threadSelected && this.state.threadId && this.state.threadName) {
      return this.renderPeerSelect(this.state.threadId, this.state.threadName)
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
  threads: ReadonlyArray<ThreadData>
}

const mapStateToProps = (state: RootState): StateProps  => {
  return {
    threads: getThreads(state, 'name')
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    completeScreen: () => { dispatch(PreferencesActions.completeTourSuccess('threadsManager' as TourScreens)) },
    refreshContacts: () => { dispatch(ContactsActions.getContactsRequest()) },
    submit: (name, navigate, selectToShare) => { dispatch(PhotoViewingActions.addThreadRequest(name, { navigate, selectToShare })) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteContactModal)
