import React from 'react'
import { View, Text, ScrollView } from 'react-native'

import Toolbar from '../../components/Toolbar'
import FeedItem from '../../components/FeedItem'
import FeedItemUpdate from '../../components/FeedItemUpdate'
import BottomBar from '../../components/BottomBar'

import styles from './statics/styles'
import list from './constants'

const Notifications = () => {
  return (
    <View style={styles.container}>
      <Toolbar>
        <Text style={styles.toolbarTitle}>Notifications</Text>
      </Toolbar>
      <FeedItemUpdate />
      <ScrollView style={styles.contentContainer}>
        { list.map((item, i) => (
          <FeedItem key={i} {...item} />
        )) }
      </ScrollView>
      <BottomBar active='feed' />
    </View>
  )
}

export default Notifications