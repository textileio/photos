import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import moment from 'moment'
import ImageSc from 'react-native-scalable-image'

import styles from './statics/styles'

function dotString(str, len) {
  if (str.length < len - 3) return str
  return str.substring(0, len-3) + '...'
}

const FeedItem = props => {
  const { category, type, read, timestamp, payload, onClick } = props
  const date = moment(timestamp).fromNow()

  const leftSource = require('./statics/main-image.png')

  let actor = ''
  let message = ''
  let rightSource = require('./statics/secure.png')

  let target
  switch (category) {
    case ('node'):
      actor = 'Your IPFS node'
      switch (type) {
        case ('onOnline'):
          message = 'connected to the network'
          rightSource = require('./statics/sync.png')
          break
        default:
          message = 'became sentient'
          rightSource = require('./statics/secure.png')
      }
      break
    case ('threads'):
      switch (type) {
        case ('onThreadAdded'):
          actor = 'You joined a thread'
          target = {id: payload.id, name: payload.name}
          message = payload.name ? ' - ' + dotString(payload.name, 22) : ''
          rightSource = require('./statics/share.png')
          break
        case ('onThreadRemoved'):
          actor = 'You left a thread'
          message = payload.name ? ' - ' + dotString(payload.name, 22) : ''
          rightSource = require('./statics/share.png')
          break
        default:
          break
      }
      break
    case ('devices'):
      switch (type) {
        case ('onDeviceAdded'):
          actor = 'You add a device'
          message = 'from your wallet'
          rightSource = require('./statics/secure.png')
          break
        case ('onDeviceRemoved'):
          actor = 'You removed a device'
          message = 'from your wallet'
          rightSource = require('./statics/secure.png')
          break
        default:
          break
      }
      break
    case ('content'):
      switch (type) {
        case ('onThreadUpdate'):
          const block = payload && payload.block
          if (block && block.type && block.type !== 4) { break }
          actor = 'New photo added'
          message = payload.thread_name ? ' - ' + dotString(payload.thread_name, 26) : ''
          target = {id: payload.thread_id, name: payload.thread_name}
          rightSource = require('./statics/secure.png')
          break
        default:
          break
      }
      break
    default:
      break
  }

  // if it's an unparsed notification type, we'll just blank it
  if (actor === '') {
    return (<View></View>)
  }

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={() => {
      onClick(category, target)
    }}>
      <View style={styles.headerIconUser}>
        <View style={styles.iconContainer}>
          <Image resizeMode={'cover'} style={{width: 29, height: 29}} source={leftSource} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}><Text style={styles.strong}>{actor}</Text> {message}</Text>
        <Text style={[styles.timestamp, !read && styles.unread]}>{date}</Text>
      </View>
      <ImageSc width={40} source={rightSource} />
    </TouchableOpacity>
  )
}

export default FeedItem
