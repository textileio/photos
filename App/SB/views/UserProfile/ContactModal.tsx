import React from 'react'
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import styles from './statics/modalStyle'
import { buttonColor1, buttonColor2, buttonColor4 } from '../../../Containers/Styles/InfoViewStyle'

interface ContactModalProps {
  width: number
  height: number
  isVisible: boolean
  onClose: () => void
}

const ContactModal = (props: ContactModalProps) => {
  const { width, height, isVisible, onClose } = props

  const openTelegram = () => Linking.openURL('https://t.me/joinchat/AAAAAEfVwD37Wh0OpnlXKA')
  const openTwitter = () => Linking.openURL('https://twitter.com/messages/compose?recipient_id=773578637320880128')
  const openEmail = () => Linking.openURL('mailto:contact@textile.io')

  return (
    <Modal
      isVisible={isVisible}
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      avoidKeyboard={true}
      backdropColor={'#E1E1E1'}
      backdropOpacity={0.5}
      style={{ width, height, margin: 0, padding: 0, justifyContent: 'flex-end' }}
    >
      <View style={[styles.container, { height }]} >
        <View style={styles.header}>
          <Text style={styles.title}>Contact Textile:</Text>
          <TouchableOpacity style={styles.closeIconPadding} onPress={onClose}>
            <Image style={styles.closeIcon} source={require('../../../Images/v2/icon-cancel.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          <View style={styles.row}>
            <Icon
              reverse={true}
              name='sc-telegram'
              type='evilicon'
              color={buttonColor1}
              onPress={openTelegram}
            />
            <Icon
              reverse={true}
              name='sc-twitter'
              type='evilicon'
              color={buttonColor2}
              onPress={openTwitter}
            />
            <Icon
              reverse={true}
              name='envelope'
              type='evilicon'
              color={buttonColor4}
              onPress={openEmail}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ContactModal
