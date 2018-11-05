import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux/index'
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native'
import QRCode from 'react-native-qrcode'
import Modal from 'react-native-modal'

import { RootAction } from '../Redux/Types'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import PreferencesActions, { TourScreens } from '../Redux/PreferencesRedux'
import {Photo} from '../Models/TextileTypes'
import Input from '../SB/components/Input'

// Styles
import styles from './Styles/ThreadCreateModal'
import { InviteQRCode } from '../Redux/ThreadsRedux'

interface DispatchProps {
  completeScreen: (threadName: string) => void
  submit: (name: string, navigate: boolean, selectToShare: boolean) => void
}

interface ScreenProps {
  invite?: InviteQRCode
  isVisible: boolean
  cancel: () => void
}

class QRCodeModal extends React.Component<DispatchProps & ScreenProps> {
  getLink (link: string): string {
    return link.replace('https://', 'textile://')
  }

  render () {
    const title = this.props.invite ? `Invite to ${this.props.invite.name}` : 'Generating Invite...'
    const subTitle = this.props.invite ? 'Have your friend point their mobile camera above.' : 'please wait'
    return (
      <Modal
        isVisible={this.props.isVisible}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard={true}
        backdropOpacity={0.5}
        style={{margin: 0, padding: 0}}
      >
      <KeyboardAvoidingView behavior={'height'} style={[styles.modal, styles.fullModal]}>
          <View style={styles.container}>
            <View style={styles.content}>
              <View style={styles.title}>
                <Text style={styles.titleText}>{title}</Text>
              </View>
              <View style={styles.qrCode}>
                {this.props.invite && <QRCode
                  value={this.getLink(this.props.invite.link)}
                  size={240}
                  bgColor='transparent'
                  fgColor='white'
                />}
              </View>
              <View style={styles.subTitle}>
                <Text style={styles.subTitleText}>{subTitle}</Text>
              </View>
              <View style={styles.bottomRow}>
                <TouchableOpacity
                  onPress={this.props.cancel}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    completeScreen: () => { dispatch(PreferencesActions.completeTourSuccess('threadsManager' as TourScreens)) },
    submit: (name, navigate, selectToShare) => { dispatch(PhotoViewingActions.addThreadRequest(name, { navigate, selectToShare })) }
  }
}

export default connect(undefined, mapDispatchToProps)(QRCodeModal)
