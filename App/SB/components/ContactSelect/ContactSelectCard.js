import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Avatar from '../../../Components/Avatar'

import RadioButton from '../../components/RadioButton'

import styles from './statics/styles'

const ContactSelectCard = (props) => {
  const { item, select, selected } = props
  const defaultSource = require('../../../Images/v2/main-image.png')

  return (
    <TouchableOpacity style={styles.contactItem} onPress={() => {
      select(item, item.included)
    }}>
      <Avatar style={styles.selectedContact} width={43} height={43} peer_id={item.id} defaultSource={defaultSource} />
      <Text style={styles.contactName}>{item.username || 'peer'}</Text>
      <View style={styles.contactSelectRadio}>
        <RadioButton disabled={item.included} selected={selected} />
      </View>
    </TouchableOpacity>
  )
}

export default ContactSelectCard
