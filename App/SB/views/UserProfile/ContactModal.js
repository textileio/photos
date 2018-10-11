import React from 'react'
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import styles from './statics/modalStyle'
import { buttonColor1, buttonColor2, buttonColor4 } from '../../../Containers/Styles/InfoViewStyle'

const ContactModal = (props) => {
  const { width, height, isVisible, onClose } = props
  return (
    <Modal
      isVisible={isVisible}
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      avoidKeyboard
      backdropColor={'#E1E1E1'}
      backdropOpacity={0.5}
      style={{ width, height, margin: 0, padding: 0, justifyContent: 'flex-end' }}
    >
      <View style={[styles.container, { height }]} >
        <View style={styles.header}>
          <Text style={styles.title}>Contact Textile:</Text>
          <TouchableOpacity style={styles.closeIconPadding} onPress={onClose}>
            <Image style={styles.closeIcon} source={require('../../components/BottomDrawerPhotos/statics/icon-cancel.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          <View style={styles.row}>
            <Icon
              reverse
              name='sc-telegram'
              type='evilicon'
              color={buttonColor1}
              onPress={() => Linking.openURL('https://t.me/joinchat/AAAAAEfVwD37Wh0OpnlXKA')}
            />
            <Icon
              reverse
              name='sc-twitter'
              type='evilicon'
              color={buttonColor2}
              onPress={() => Linking.openURL('https://twitter.com/messages/compose?recipient_id=773578637320880128')}
            />
            <Icon
              reverse
              name='envelope'
              type='evilicon'
              color={buttonColor4}
              onPress={() => Linking.openURL('mailto:contact@textile.io')}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ContactModal
