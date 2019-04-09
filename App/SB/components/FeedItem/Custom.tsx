import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Avatar from '../../../Components/Avatar'

import styles from './statics/styles'

interface OwnProps {
  title: string,
  subtitle: string,
  onClick: () => void
}

class CustomFeedItem extends React.PureComponent<OwnProps> {
  render() {
    const readStyle = {
      width: 29,
      height: 29,
      borderRadius: 16
    }

    const leftSource = (
      <View
        style={{...readStyle, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}
      >
        <Avatar
          style={{ width: 24, height: 24 }}
        />
      </View>
    )

    return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.itemContainer}
      onPress={this.props.onClick}
    >
      <View style={styles.headerIconUser}>
        <View style={styles.iconContainer}>
          {leftSource}
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{this.props.title}</Text>
        <Text style={[styles.timestamp, styles.unread]}>{this.props.subtitle}</Text>
      </View>
      <View style={{ width: 40, height: 40, overflow: 'hidden' }}/>
    </TouchableOpacity>
    )
  }
}

export default CustomFeedItem
