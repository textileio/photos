import React from 'react'
import { View, TouchableOpacity, Text, Dimensions } from 'react-native'
import Avatar from './Avatar'
import style from './Styles/WalletHeader'

// needed a dynamic width for the word, "contacts" to fit in single row column
const containerWidth = (Dimensions.get('window').width - 100) / 3
const labelSize = Math.min(containerWidth / (8 * 0.5476) - 5, 14)

export interface IWalletHeaderProps {
  overview: {
    available: boolean,
    photoCount: string,
    photoTitle: string,
    groupCount: string,
    groupTitle: string,
    contactCount: string,
    contactTitle: string
  },
  selectedTab: string,
  username: string,
  changeAvatar: () => void,
  onToggle: (value: string) => void
  verboseUi?: boolean
}

const WalletHeader = (props: IWalletHeaderProps) => {
  const { overview, selectedTab, username, changeAvatar, onToggle } = props

  const toggle = (value: string) => {
    return () => {
      onToggle(value)
    }
  }
  const statButton = (title: string, count: string, countTitle: string) => {
    return (
      <TouchableOpacity style={style.walletButton} onPress={toggle(title)} activeOpacity={0.9}>
        <Text style={[style.walletButtonNumber, selectedTab === title && style.walletSelected]}>{count}</Text>
        <Text style={[style.walletButtonText, selectedTab === title && style.walletSelected, {fontSize: labelSize}]}>{countTitle}</Text>
      </TouchableOpacity>
    )
  }

  // calculate the line with the prefix or without, if without the line will wrap but still have prefix
  const usernamePrefix = username && username.length < 11 ? 'Hello, ' : ''
  const userWelcome = `${usernamePrefix}${username}`
  const availableWidth = (Dimensions.get('window').width - 140)
  const usernameSize = Math.min(availableWidth / (userWelcome.length * 0.5476), 23)

  return (
    <View style={style.walletHeader}>
      <TouchableOpacity
        style={style.walletAvatar}
        onPress={changeAvatar}
      >
        <Avatar style={{ width: 90, height: 90 }} />
      </TouchableOpacity>
      <View style={style.walletInfo}>
        <View style={style.walletTop}>
          <Text style={[style.walletUsername, , {fontSize: usernameSize}]}>{`Hello, ${username}`}</Text>
        </View>
        <View style={style.walletBottom}>
          {props.verboseUi && statButton('Photos', overview.photoCount, overview.photoTitle)}
          {statButton('Groups', overview.groupCount, overview.groupTitle)}
          {statButton('Contacts', overview.contactCount, overview.contactTitle)}
        </View>
      </View>
    </View>
  )
}

export default WalletHeader
