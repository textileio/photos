import React from 'react'
import { View, Text, Image, ScrollView } from 'react-native'

import Toolbar from '../../components/Toolbar'
import PhotoWithTextBox from '../../components/PhotoWithTextBox'

import styles from './statics/styles'

const UserProfile = () => {
  return (
    <View style={styles.container}>
      <Toolbar
        left={<Image style={styles.toolbarLeft} source={require('./statics/icon-arrow-left.png')} />}
      >
        <View style={styles.toolbarBottom}>
          <View style={styles.toolbarTitle}>
            <Text style={styles.toolbarUserName}>Briana Casali</Text>
            <Text style={styles.toolbarThreadsQty}><Text style={styles.strong}>6</Text> Threads</Text>
          </View>
          <Image style={styles.toolbarImage} source={require('./statics/icon-user.png')} />
        </View>
      </Toolbar>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Threads in common with Briana:</Text>
        <ScrollView>
          <PhotoWithTextBox photo={require('./statics/photo1.png')} text='San Francisco' />
          <PhotoWithTextBox photo={require('./statics/photo1.png')} text='San Francisco' />
          <PhotoWithTextBox photo={require('./statics/photo1.png')} text='San Francisco' />
        </ScrollView>
      </View>
    </View>
  )
}

export default UserProfile
