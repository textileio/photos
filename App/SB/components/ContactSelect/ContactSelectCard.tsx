import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from '@textile/react-native-icon'

import Avatar from '../../../Components/Avatar'
import ImageSc from 'react-native-scalable-image'

import RadioButton from '../RadioButton'

import styles from './statics/styles'
import { IncludedContact } from '.'

interface ContactLinkCardProps {
  text: string
  icon: string
  select: () => void
}

interface ContactSelectCardProps {
  item: IncludedContact
  select: (item: IncludedContact, included: boolean) => void
  selected: boolean
}

const ContactSelectCard = (props: ContactSelectCardProps) => {
  const { item, select, selected } = props

  const onPress = () => {
    select(item, item.included)
  }

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.contactItem}
      onPress={onPress}
    >
      <Avatar style={styles.selectedContact} target={item.avatar} />
      <Text style={styles.contactName}>{item.name || 'peer'}</Text>
      <View style={styles.contactSelectRadio}>
        <RadioButton disabled={item.included} selected={selected} />
      </View>
    </TouchableOpacity>
  )
}

export const ContactLinkCard = (props: ContactLinkCardProps) => {
  const { text, icon, select } = props
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.contactItem}
      onPress={select}
    >
      {icon === 'qr-code' && (
        <ImageSc
          source={require('../../../Images/v2/qr.png')}
          width={20}
          height={20}
          resizeMode={'cover'}
          style={styles.linkIcon}
        />
      )}
      {icon !== 'qr-code' && (
        <Icon name={icon} size={20} color={'#2E8BFE'} style={styles.linkIcon} />
      )}
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  )
}

export default ContactSelectCard
