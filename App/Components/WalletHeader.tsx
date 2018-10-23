import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import SwitchSelector from 'react-native-switch-selector'
import Avatar from './Avatar'
import style from './Styles/WalletHeader'

export interface IWalletHeaderProps {
  username: string,
  selectedTab: string,
  avatarUrl: string,
  changeAvatar: () => void,
  onToggle: (value: string) => void
}

const WalletHeader = (props: IWalletHeaderProps) => {
  const { changeAvatar, onToggle, selectedTab } = props
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
          <Text style={style.walletUsername}>Hello, bbbbbb</Text>
        </View>
        <View style={style.walletBottom}>
          <TouchableOpacity style={style.walletButton} onPress={toggle('Photos')}>
            <Text style={[style.walletButtonNumber, selectedTab === 'Photos' && style.walletSelected]}>8</Text>
            <Text style={[style.walletButtonText, selectedTab === 'Photos' && style.walletSelected]}>Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.walletButton} onPress={toggle('Threads')}>
            <Text style={[style.walletButtonNumber, selectedTab === 'Threads' && style.walletSelected]}>8</Text>
            <Text style={[style.walletButtonText, selectedTab === 'Threads' && style.walletSelected]}>Threads</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.walletButton} onPress={toggle('Peers')}>
            <Text style={[style.walletButtonNumber, selectedTab === 'Peers' && style.walletSelected]}>8</Text>
            <Text style={[style.walletButtonText, selectedTab === 'Peers' && style.walletSelected]}>Peers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default WalletHeader
