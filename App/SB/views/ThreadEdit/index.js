import React from 'react'
import { View, Text, Image } from 'react-native'

import Toolbar from '../../components/Toolbar'
import Input from '../../components/Input'
import ContactSelect from '../../components/ContactSelect'

import styles from './statics/styles'

const ThreadAddPhoto = () => {
  return (
    <View style={styles.container}>
      <Toolbar
        left={<Image style={styles.toolbarLeft} source={require('./statics/icon-arrow-left.png')} />}
        right={
          <View style={styles.toolBarRight}>
            <Text style={styles.link}>Next</Text>
          </View>
        } />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Edit publication</Text>
        <View style={styles.formContainer}>
          <Image style={styles.formImage} source={require('./statics/photo1.png')} />
          <Input labelStyle={styles.labelStyle} label='Write a caption' />
        </View>
      </View>
      <ContactSelect />
    </View>
  )
}

export default ThreadAddPhoto
