import React from 'react'
import moment from 'moment'
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native'
import * as NotificationServices from '../../../Services/Notifications'
import Avatar from '../../../Components/Avatar'
import TextileImage from '../../../Components/TextileImage'

import styles from './statics/styles'
import { color } from '../../../styles'

interface AlertRowProps {
  message: string
  onClick: () => void
}

class AlertRow extends React.PureComponent<AlertRowProps> {
  render() {
    const { message, onClick } = this.props
    const dateText = 'now'

    const readStyle: ViewStyle = {
      width: 29,
      height: 29,
      borderRadius: 16,
      borderWidth: 0,
      borderColor: 'rgba(255, 28, 63, 0.2)',
      backgroundColor: 'rgba(255, 28, 63, 0.2)'
    }

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.itemContainer}
        onPress={this.props.onClick}
      >
        <View style={styles.headerIconUser}>
          <View style={styles.iconContainer}>
            <View
              style={{
                ...readStyle,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center'
              }}
            />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{message}</Text>
          <Text style={[styles.timestamp, styles.unread]}>{dateText}</Text>
        </View>
        <View style={{ width: 40, height: 40, overflow: 'hidden' }} />
      </TouchableOpacity>
    )
  }
}

export default AlertRow
