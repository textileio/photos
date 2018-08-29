import React  from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import Avatar from './Avatar'
import style from './Styles/WalletHeader'

export type WalletHeaderProps = {
  overview: {
    available: boolean,
    peerCount: string,
    peerTitle: string,
    threadCount: string,
    threadTitle: string,
    photoCount: string,
    photoTitle: string
  },
  avatarUrl: string,
  changeAvatar: () => void,
  updateSettings: () => void,
  viewThreads: () => void,
}

const WalletHeader = (props: WalletHeaderProps) => {
  const { overview, changeAvatar, updateSettings, viewThreads } = props
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
        />
      </TouchableOpacity>
      <View style={style.walletStats}>
        <View style={style.walletStatsTop}>
          <View
            style={style.walletStatsTopColumn}
          >
            <Text style={[style.walletStatsCount, !overview.available && style.statDim]}>
              {overview.photoCount}
            </Text>
            <Text style={style.walletStatsTitle}>
              {overview.photoTitle}
            </Text>
          </View>
          <View
            style={style.walletStatsTopColumn}
          >
            <Text style={[style.walletStatsCount, !overview.available && style.statDim]}>{overview.peerCount}</Text>
            <Text style={style.walletStatsTitle}>
              {overview.peerTitle}
            </Text>
          </View>
          <TouchableOpacity
            style={style.walletStatsTopColumn}
            onPress={viewThreads}
          >
            <Text style={[style.walletStatsCount, !overview.available && style.statDim]}>{overview.threadCount}</Text>
            <Text style={style.walletStatsTitle}>
              {overview.threadTitle}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={style.walletStatsBottom}>
          <TouchableOpacity
            style={style.walletSettingsButton}
            onPress={updateSettings}
          >
            <Text style={style.walletSettingsText}>View Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default WalletHeader
