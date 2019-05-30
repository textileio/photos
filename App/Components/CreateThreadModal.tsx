import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux/index'
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Picker
} from 'react-native'
import Modal from 'react-native-modal'
import { Thread } from '@textile/react-native-sdk'

import { Thread } from '@textile/react-native-sdk'

import { RootAction } from '../Redux/Types'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import PreferencesActions, { TourScreens } from '../Redux/PreferencesRedux'
import Input from '../SB/components/Input'

// Styles
import styles from './Styles/ThreadCreateModal'

interface DispatchProps {
  completeScreen: (threadName: string) => void
  submit: (name: string, navigate: boolean, selectToShare: boolean) => void
}

interface ModalProps {
  isVisible: boolean
}

interface ScreenProps {
  selectToShare?: boolean
  navigateTo?: boolean
  fullScreen?: boolean
  cancel: () => void
  complete: () => void
}

class Component extends React.Component<DispatchProps & ScreenProps> {
  state = {
    value: '',
    submitted: false,
    type: Thread.Type.OPEN,
    sharing: Thread.Sharing.SHARED
  }

  handleNewText = (text: string) => {
    this.setState({ value: text })
  }

  handleNewSharing = (val, index) => {
    this.setState({
      sharing: val
    })
  }

  handleNewType = (val, index) => {
    this.setState({
      type: val
    })
  }

  create() {
    return () => {
      if (this.state.submitted) {
        return
      }
      this.setState({submitted: true})
      this.props.completeScreen(this.state.value)
      const config = {
        name: this.state.value,
        type: this.state.type,
        sharing: this.state.sharing
      }
      this.props.submit(
        config,
        !!this.props.navigateTo,
        !!this.props.selectToShare
      )
      this.props.complete()
    }
  }

  render() {
    const submitDisabled = !(this.state.value.length > 0)
    return (
      <KeyboardAvoidingView behavior={'height'} style={styles.modal}>
          <View style={styles.container}>
            <View style={styles.content}>
              {this.props.fullScreen && <View style={styles.title}>
                <Text style={styles.titleText}>New Group</Text>
              </View>}
              {!this.props.fullScreen && <View style={styles.header}>
                <Text style={styles.headerText}>New Group</Text>
              </View>}
              <View style={styles.topRow}>
                <Input
                  style={styles.inputStyle}
                  value={this.state.value}
                  label={this.state.value === '' ? 'Add title...' : ''}
                  onChangeText={this.handleNewText}
                />
              </View>
              <View style={[styles.bottomRow, !this.props.fullScreen && styles.bottomRowMargin]}>
                <TouchableOpacity
                  onPress={this.props.cancel}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={submitDisabled}
                  onPress={this.create()}
                >
                  <Text style={[styles.buttonText, submitDisabled && styles.disabled]}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    completeScreen: () => { dispatch(PreferencesActions.completeTourSuccess('threadsManager' as TourScreens)) },
    submit: (config, navigate, selectToShare) => { dispatch(PhotoViewingActions.addThreadRequest({ ...config, whitelist: [] }, { navigate, selectToShare })) }
  }
}

export const CreateThreadComponent = connect(undefined, mapDispatchToProps)(Component)

export default class CreateThreadModal extends React.Component<ScreenProps & ModalProps> {
  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard={true}
        backdropOpacity={0.5}
        style={{margin: 0, padding: 0}}
      >
        <CreateThreadComponent {...this.props} />
      </Modal>
    )
  }
}
