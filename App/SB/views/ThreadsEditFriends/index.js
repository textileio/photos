import React from 'react'
import { View, Text, Image } from 'react-native'

import Toolbar from '../../components/Toolbar'
import ContactSelect from '../../components/ContactSelect'

import styles from './statics/styles'

const ThreadsEdit = () => {
  return (
    <View style={styles.container}>
      <Toolbar
        left={<Image style={styles.toolbarLeft} source={require('./statics/icon-arrow-left.png')} />}
        right={
          <View style={styles.toolBarRight}>
            <Text style={styles.link}>Save</Text>
          </View>
        } />
      <ContactSelect />
    </View>
  )
}

export default ThreadsEdit