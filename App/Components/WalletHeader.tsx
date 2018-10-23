import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
// react-native-switch-selector shouldn't be a long-run module, just a temp 
// add to start testing out reconfig of the wallet
// @ts-ignore
import SwitchSelector from 'react-native-switch-selector'
import Avatar from './Avatar'
import style from './Styles/WalletHeader'

export interface IWalletHeaderProps {
  username: string,
  selectedTab: string,
  avatarUrl: string,
  changeAvatar: () => void,
  onToggle: () => void
}

const WalletHeader = (props: IWalletHeaderProps) => {
  const { changeAvatar, onToggle, selectedTab } = props
  const options = [
    { label: 'Photos', value: 'Photos' },
    { label: 'Threads', value: 'Threads' }
  ]
  const initialTab = selectedTab === 'Threads' ? 1 : 0
  return (
    <View style={style.walletHeader}>
      <TouchableOpacity
        style={style.walletAvatar}
        onPress={changeAvatar}
      >
        <Avatar
          width={96}
          height={96}
          defaultSource={require('../Images/v2/update-avatar.png')}
          owner={true}
        />
      </TouchableOpacity>
      <View style={style.walletInfo}>
        <View style={style.walletTop}>
          <Text style={style.walletUsername}>Hello, bbbbbb</Text>
        </View>
        <View style={style.walletBottom}>
          <SwitchSelector onPress={onToggle} options={options} initial={initialTab} buttonColor={'#ededed'} selectedColor={'#333333'} textColor={'#777777'} />
        </View>
      </View>
    </View>
  )
}

export default WalletHeader
