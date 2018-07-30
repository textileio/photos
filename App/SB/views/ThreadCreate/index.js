import React from 'react'
import { View, Text, Image, ScrollView } from 'react-native'

import Toolbar from '../../components/Toolbar'
import BottomBar from '../../components/BottomBar'
import Input from '../../components/Input'

import styles from './statics/styles'

const ThreadsEdit = () => {
  return (
    <View style={styles.container}>
      <Toolbar
        left={<Image style={styles.toolbarLeft} source={require('./statics/icon-arrow-left.png')} />}
        right={
          <View style={styles.toolBarRight}>
            <Text style={styles.link}>Next</Text>
          </View>
        } />
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>New thread</Text>
        <Input
          labelStyle={{
            color: '#9b9b9b',
            fontSize: 16
          }}
          label='Add a title'
        />
      </ScrollView>
      <BottomBar active='threads' />
    </View>
  )
}

export default ThreadsEdit
