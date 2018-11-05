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

import { RootAction } from '../Redux/Types'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import PreferencesActions, { TourScreens } from '../Redux/PreferencesRedux'
import {Photo} from '../Models/TextileTypes'
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
    submitted: false
  }

  handleNewText = () => {
    return (text: string) => {
      this.setState({ value: text })
    }
  }

  _submitWithPhoto (withPhoto: Photo) {
    const withThreadName = this.state.value
  }

  create () {
    return () => {
      if (this.state.submitted) {
        return
      }
      this.setState({submitted: true})
      this.props.completeScreen(this.state.value)
      this.props.submit(
        this.state.value,
        !!this.props.navigateTo,
        !!this.props.selectToShare
      )
      this.props.complete()
    }
  }

  render () {
    const submitDisabled = !(this.state.value.length > 0)
    const modalStyle = this.props.fullScreen ? styles.fullModal : styles.slideModal
    return (
      <KeyboardAvoidingView behavior={'height'} style={[styles.modal, modalStyle]}>
          <View style={styles.container}>
            <View style={styles.content}>
              {this.props.fullScreen && <View style={styles.title}>
                <Text style={styles.titleText}>Create New Thread</Text>
              </View>}
              {!this.props.fullScreen && <View style={styles.header}>
                <Text style={styles.headerText}>Create New Thread</Text>
              </View>}
              <View style={styles.topRow}>
                <Input
                  style={styles.inputStyle}
                  value={this.state.value}
                  label={this.state.value === '' ? 'Add title...' : ''}
                  onChangeText={this.handleNewText()}
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
    submit: (name, navigate, selectToShare) => { dispatch(PhotoViewingActions.addThreadRequest(name, { navigate, selectToShare })) }
  }
}

export const CreateThreadComponent = connect(undefined, mapDispatchToProps)(Component)

export default class CreateThreadModal extends React.Component<ScreenProps & ModalProps> {
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
        <CreateThreadComponent {...this.props} />
      </Modal>
    )
  }
}
