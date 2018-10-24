import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import Avatar from './Avatar'
import style from './Styles/WalletHeader'

export interface IWalletHeaderProps {
  overview: {
    available: boolean,
    photoCount: string,
    photoTitle: string,
    threadCount: string,
    threadTitle: string,
    peerCount: string,
    peerTitle: string
  },
  selectedTab: string,
  username: string,
  changeAvatar: () => void,
  onToggle: (value: string) => void
}

const WalletHeader = (props: IWalletHeaderProps) => {
  const { overview, selectedTab, username, changeAvatar, onToggle } = props
  const options = [
    { label: 'Photos', value: 'Photos' },
    { label: 'Threads', value: 'Threads' },
    { label: 'Peers', value: 'Threads' }
  ]
  const initialTab = selectedTab === 'Threads' ? 1 : 0
  const toggle = (value: string) => {
    return () => {
      onToggle(value)
    }
  }
  const statButton = (title: string, count: string, countTitle: string) => {
    return (
      <TouchableOpacity style={style.walletButton} onPress={toggle(title)} activeOpacity={0.9}>
        <Text style={[style.walletButtonNumber, selectedTab === title && style.walletSelected]}>{count}</Text>
        <Text style={[style.walletButtonText, selectedTab === title && style.walletSelected]}>{countTitle}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={style.walletHeader}>
      <TouchableOpacity
        style={style.walletAvatar}
        onPress={changeAvatar}
      >
        <Avatar
          width={90}
          height={90}
          defaultSource={require('../Images/v2/update-avatar.png')}
          owner={true}
        />
      </TouchableOpacity>
      <View style={style.walletInfo}>
        <View style={style.walletTop}>
          <Text style={style.walletUsername}>Hello, {username}</Text>
        </View>
        <View style={style.walletBottom}>
          {statButton('Photos', overview.photoCount, overview.photoTitle)}
          {statButton('Threads', overview.threadCount, overview.threadTitle)}
          {statButton('Peers', overview.peerCount, overview.peerTitle)}
        </View>
      </View>
    </View>
  )
}

export default WalletHeader
