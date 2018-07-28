import React from 'react'
import { View, Text, Image } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import Toolbar from '../../components/Toolbar'

import styles from './statics/styles'

const UserProfile = () => {
  return (
    <View style={styles.container}>
      <Toolbar
        left={<Image style={styles.toolbarLeft} source={require('./statics/icon-arrow-left.png')} />}
      >
        <View style={styles.toolbarBottom}>
          <View style={styles.toolbarTitle}>
            <Text style={styles.toolbarUserName}>Hello Briana</Text>
            <Text style={styles.toolbarThreadsQty}><Text style={styles.strong}>3,423</Text> Photos</Text>
          </View>
          <Image style={styles.toolbarImage} source={require('./statics/icon-user.png')} />
        </View>
      </Toolbar>
      <View style={styles.contentContainer}>
        <View style={styles.listItem}>
          <Text style={styles.listText}>Settings</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listText}>Privacy</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listText}>Notifications</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listText}>Help</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listText}>Invite</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={[styles.listText, styles.warning]}>Logout</Text>
        </View>
        <View style={styles.servers}>
          <View style={styles.activeIcon} />
          <Text style={styles.serversText}>Connected to <Text style={styles.strong}>23</Text> servers</Text>
        </View>
        <View style={styles.logoContainer}>
          <ImageSc width={83} source={require('./statics/textile-gray-logo.png')} />
        </View>
      </View>
    </View>
  )
}

export default UserProfile