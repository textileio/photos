import React from 'react'
import { View, Text, TouchableOpacity, Switch } from 'react-native'
import ImageSc from 'react-native-scalable-image'
import styles from './statics/styles'
import { ServiceInfo } from '../../views/Notifications'
import { StorageDescription } from '../../views/Storage/GetServiceInfo'

interface SettingsRowProps {
  service: string
  info: ServiceInfo | StorageDescription
  infoPress: (service: string) => void
  value: boolean
  onChange: (service: string) => void
  child?: string
  disabled?: boolean
}

const SettingsRow = (props: SettingsRowProps) => {
  const { service, info, infoPress, value, onChange, child, disabled } = props
  const onValueChange = () => {
    onChange(service)
  }
  const onPress = () => {
    infoPress(service)
  }
  return (
    <View style={[styles.listItem, child !== undefined && styles.childItem]}>
      <View>
        <Text
          style={[
            child === undefined && styles.itemTitle,
            child !== undefined && styles.childTitle,
            disabled && styles.disabledTitle
          ]}
        >
          {info.title}
        </Text>
        {!child && (
          <View style={styles.itemTexts}>
            <Text style={styles.itemDescription}>{info.subtitle}</Text>
            {info.hasOwnProperty('details') && (
              <TouchableOpacity onPress={onPress}>
                <ImageSc
                  width={15}
                  source={require('./statics/icon-info.png')}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <Switch
        disabled={disabled}
        value={!disabled && value}
        onValueChange={onValueChange}
      />
    </View>
  )
}

export default SettingsRow
