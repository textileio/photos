import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux/index'
import { View, Text } from 'react-native'
import Modal from 'react-native-modal'
import { Thread } from '@textile/react-native-sdk'

import ModalButtons from './ModalButtons'
import { CreateThreadComponent } from './CreateThreadModal'

import { RootAction, RootState } from '../Redux/Types'
import PhotoViewingActions, { ThreadData } from '../Redux/PhotoViewingRedux'
import PreferencesActions, { TourScreens } from '../Redux/PreferencesRedux'
import { getThreads } from '../Redux/PhotoViewingSelectors'

import { ThreadSelectComponent } from '../SB/components/ThreadSelect'
import { ThreadsEditFriendsComponent } from '../SB/views/ThreadsEditFriends'

// Styles
import styles from './Styles/InviteContactModalStyles'

interface DispatchProps {
  completeScreen: (threadName: string) => void
  submit: (name: string, navigate: boolean, selectToShare: boolean) => void
}

interface ScreenProps {
  isVisible: boolean
  selectedThreadId?: string
  selectedThreadName?: string
  cancel: () => void
}

interface State {
  submitted: boolean
  showCreateGroupModal: boolean
  threadId?: string
  threadName?: string
  threadSelected: boolean
}

type Props = DispatchProps & StateProps & ScreenProps

class InviteContactModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      submitted: false,
      showCreateGroupModal: false,
      threadSelected: props.selectedThreadId !== undefined,
      threadId: props.selectedThreadId,
      threadName: props.selectedThreadName
    }
  }

  openThreadModal() {
    return () => {
      this.setState({
        showCreateGroupModal: true,
        threadId: undefined,
        threadName: undefined
      })
    }
  }

  cancelCreateThread() {
    return () => {
      this.setState({ showCreateGroupModal: false })
    }
  }

  completeCreateThread() {
    return () => {
      this.setState({ showCreateGroupModal: false })
    }
  }

  selectThread() {
    return (threadId: string) => {
      const thread = this.props.threads.find(t => t.id === threadId)
      const threadName = thread ? thread.name : 'thread'
      this.setState({ threadId, threadName })
    }
  }

  cancel() {
    return () => {
      this.props.cancel()
    }
  }

  continue() {
    return () => {
      this.setState({ threadSelected: true })
    }
  }

  cancelPeerRequest() {
    return () => {
      this.setState({
        threadId: this.props.selectedThreadId,
        threadName: this.props.selectedThreadName,
        threadSelected: this.props.selectedThreadId !== undefined
      })
      this.props.cancel()
    }
  }

  renderThreadSelect() {
    return (
      <View style={styles.content}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Invite others</Text>
          <Text style={styles.subTitleText}>
            Select an existing group or create a new one.
          </Text>
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

  renderPeerSelect(threadId: string, threadName: string) {
    return (
      <ThreadsEditFriendsComponent
        threadId={threadId}
        threadName={threadName}
        cancel={this.cancelPeerRequest()}
      />
    )
  }

  renderCreateThread() {
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

  renderBody() {
    if (this.state.showCreateGroupModal) {
      return this.renderCreateThread()
    } else if (
      this.state.threadSelected &&
      this.state.threadId &&
      this.state.threadName
    ) {
      return this.renderPeerSelect(this.state.threadId, this.state.threadName)
    }
    return this.renderThreadSelect()
  }

  render() {
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

const mapStateToProps = (state: RootState): StateProps => {
  return {
    threads: getThreads(state, 'name')
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  const threadConfig = {
    type: Thread.Type.OPEN,
    sharing: Thread.Sharing.SHARED,
    whitelist: []
  }
  return {
    completeScreen: () => {
      dispatch(
        PreferencesActions.completeTourSuccess('threadsManager' as TourScreens)
      )
    },
    submit: (name, navigate, selectToShare) => {
      dispatch(
        PhotoViewingActions.addThreadRequest(
          { ...threadConfig, name },
          { navigate, selectToShare }
        )
      )
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteContactModal)
