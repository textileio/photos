import React from 'react'
import { View, Text, TouchableOpacity, Switch } from 'react-native'
import ImageSc from 'react-native-scalable-image'
import styles from './statics/styles'

const SettingsRow = (props) => {
  const { service, info, infoPress, value, onChange, child, disabled } = props
  return (
    <View style={[styles.listItem, child && styles.childItem]}>
      <View>
        <Text style={[!child && styles.itemTitle, child && styles.childTitle, disabled && styles.disabledTitle]}>{info.title}</Text>
        { !child && <View style={styles.itemTexts}>
          <Text style={styles.itemDescription}>{info.subtitle}</Text>
          {info.hasOwnProperty('details') && <TouchableOpacity onPress={() => { infoPress(service) }}>
            <ImageSc width={15} source={require('./statics/icon-info.png')} />
          </TouchableOpacity>}
        </View>}
      </View>
      <Switch disabled={disabled} value={!disabled && value} onValueChange={() => {
        onChange(service)
      }} />
    </View>
  )
}

export default SettingsRow
