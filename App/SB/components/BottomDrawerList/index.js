import React from 'react'
import { View, Text, Image } from 'react-native'

import Drawer from '../../components/BottomDrawer'

import styles from './statics/styles'

const BottomDrawerList = () => {
  return (
    <Drawer overlay style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose an option</Text>
        <Image style={styles.closeIcon} source={require('./statics/icon-cancel.png')} />
      </View>
      <View style={styles.listContainer}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>Take a photo</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>Select a photo from my Wallet</Text>
        </View>
      </View>
    </Drawer>
  )
}

export default BottomDrawerList
