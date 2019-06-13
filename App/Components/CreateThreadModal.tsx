import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux/index'
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native'
import Modal from 'react-native-modal'

import { Thread } from '@textile/react-native-sdk'

import { RootAction } from '../Redux/Types'
import PhotoViewingActions, { ThreadConfig } from '../Redux/PhotoViewingRedux'
import PreferencesActions, { TourScreens } from '../Redux/PreferencesRedux'
import Input from '../SB/components/Input'

// Styles
import styles from './Styles/ThreadCreateModal'

interface DispatchProps {
  completeScreen: (threadName: string) => void
  submit: (
    threadConfig: ThreadConfig,
    navigate: boolean,
    selectToShare: boolean
  ) => void
}

interface ScreenProps {
  isVisible: boolean
  selectToShare?: boolean
  navigateTo?: boolean
  fullScreen?: boolean
  invites?: ReadonlyArray<string>
  defaultName?: string
  type?: Thread.Type
  sharing?: Thread.Sharing
  whitelist?: ReadonlyArray<string>
  cancel: () => void
  complete: () => void
}

type Props = DispatchProps & ScreenProps

interface State {
  value: string
  submitted: boolean
}

class CreateThreadComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: props.defaultName ? props.defaultName : '',
      submitted: false
    }
  }

  handleNewText = (text: string) => {
    this.setState({ value: text })
  }

  create() {
    return () => {
      if (this.state.submitted) {
        return
      }
      this.setState({ submitted: true })
      this.props.completeScreen(this.state.value)
      const threadConfig = {
        type:
          this.props.type !== undefined ? this.props.type : Thread.Type.OPEN,
        sharing:
          this.props.sharing !== undefined
            ? this.props.sharing
            : Thread.Sharing.SHARED,
        whitelist:
          this.props.whitelist !== undefined ? this.props.whitelist : [],
        name: this.state.value
      }
      this.props.submit(
        threadConfig,
        Boolean(this.props.navigateTo),
        Boolean(this.props.selectToShare)
      )
      this.props.complete()
    }
  }

  render() {
    const submitDisabled = !(this.state.value.length > 0)
    return (
      <Modal
        isVisible={this.props.isVisible}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard={true}
        backdropOpacity={0.5}
        style={{ margin: 0, padding: 0 }}
      >
        <KeyboardAvoidingView behavior={'height'} style={styles.modal}>
          <View style={styles.container}>
            <View style={styles.content}>
              {this.props.fullScreen && (
                <View style={styles.title}>
                  <Text style={styles.titleText}>New Group</Text>
                </View>
              )}
              {!this.props.fullScreen && (
                <View style={styles.header}>
                  <Text style={styles.headerText}>New Group</Text>
                </View>
              )}
              <View style={styles.topRow}>
                <Input
                  style={styles.inputStyle}
                  value={this.state.value}
                  label={this.state.value === '' ? 'Add title...' : ''}
                  onChangeText={this.handleNewText}
                />
              </View>
              <View
                style={[
                  styles.bottomRow,
                  !this.props.fullScreen && styles.bottomRowMargin
                ]}
              >
                <TouchableOpacity onPress={this.props.cancel}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={submitDisabled}
                  onPress={this.create()}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      submitDisabled && styles.disabled
                    ]}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>,
  ownProps: ScreenProps
): DispatchProps => {
  return {
    completeScreen: () => {
      dispatch(
        PreferencesActions.completeTourSuccess('threadsManager' as TourScreens)
      )
    },
    submit: (threadConfig, navigate, selectToShare) => {
      dispatch(
        PhotoViewingActions.addThreadRequest(threadConfig, {
          navigate,
          selectToShare,
          invites: ownProps.invites
        })
      )
    }
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(CreateThreadComponent)
