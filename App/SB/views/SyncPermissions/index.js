import React  from 'react'
import { View, Text, Switch, ScrollView } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import Button from '../../components/Button'

import styles from './statics/styles'

const SyncPermissions = props => {
  const { } = props

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ImageSc width={147} source={require('./statics/main-image.png')} />
        <Text style={styles.title}>To make everything run we need a few permissions</Text>
      </View>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.listContainer}>
          <View style={styles.listItem}>
            <View>
              <Text style={styles.itemTitle}>Camera Roll</Text>
              <View style={styles.itemTexts}>
                <Text style={styles.itemDescription}>Updates your photos</Text>
                <ImageSc width={15} source={require('./statics/icon-info.png')} />
              </View>
            </View>
            <Switch />
          </View>
          <View style={styles.listItem}>
            <View>
              <Text style={styles.itemTitle}>Location</Text>
              <View style={styles.itemTexts}>
                <Text style={styles.itemDescription}>Updates your location</Text>
                <ImageSc width={15} source={require('./statics/icon-info.png')} />
              </View>
            </View>
            <Switch />
          </View>
          <View style={styles.listItem}>
            <View>
              <Text style={styles.itemTitle}>Background Location</Text>
              <View style={styles.itemTexts}>
                <Text style={styles.itemDescription}>Trigger app updates</Text>
                <ImageSc width={15} source={require('./statics/icon-info.png')} />
              </View>
            </View>
            <Switch />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button style={styles.button} text='Continue' onPress={() => {}} />
      </View>
    </View>
  )
}

export default SyncPermissions