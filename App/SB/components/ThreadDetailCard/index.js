import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import Dash from 'react-native-dash'
import moment from 'moment'
import TextileImage from '../../../../TextileImage'

import SmallIconTag from '../SmallIconTag'

import styles from './statics/styles'

const lessThanFiveMinutesAgo = (date) => {
  return date.isAfter(moment().subtract(5, 'minutes'))
}
const lessThanOneHourAgo = (date) => {
  return date.isAfter(moment().subtract(1, 'hours'))
}
const lessThanOneDayAgo = (date) => {
  return date.isAfter(moment().subtract(1, 'days'))
}

const ThreadDetailCard = props => {
  const { type, last } = props
  switch (type) {
    case 'photo': {
      const date = moment(props.photo.date)
      let dateSmall = ''
      let dateLarge = ''
      if (lessThanFiveMinutesAgo(date)) {
        dateSmall = 'just'
        dateLarge = 'NOW'
      } else if (lessThanOneHourAgo(date)) {
        dateSmall = 'min'
        dateLarge = Math.abs(date.diff(moment(), 'm'))
      } else if (lessThanOneDayAgo(date)) {
        dateSmall = date.format('A')
        dateLarge = date.format('H')
      } else {
        dateSmall = date.format('MMM')
        dateLarge = date.format('DD')
      }

      let caption = props.photo.caption
      if (caption > 90) {
        caption = props.photo.caption.substring(0, 87)
        caption = caption.substring(0, caption.lastIndexOf(' ')) + '...'
      }

      let username = "anonymous"
      if (props.metadata && props.metadata.username) {
        username = props.metadata.username
      }

      return (
        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <View style={styles.dateContainer}>
              <Text style={styles.month}>{dateSmall.toUpperCase()}</Text>
              <Text style={styles.day}>{dateLarge}</Text>
            </View>
            { !last && <Dash style={styles.carLeftLine} dashLength={4} dashGap={3} dashColor='#979797' /> }
          </View>
          <View style={styles.cardRight}>
            <Text style={styles.cardAction}><Text style={styles.cardActionName}>{username}</Text> added a photo</Text>
            <TouchableOpacity style={styles.cardImage} onPress={() => {
              props.onSelect(props.photo.id)
            }} >
              <View style={styles.imageStretch}>
                <TextileImage
                  imageId={props.photo.id}
                  path={'thumb'}
                  style={styles.image}
                  resizeMode={'cover'}
                  width={280}
                  height={200}
                />
              </View>
            </TouchableOpacity>
            <SmallIconTag syle={{flexDirection: 'row'}} text={ caption } image={require('./statics/icon-comment.png')} />
          </View>
        </View>
      )
    }

    case 'contacts': {
      return (
        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <View style={styles.dateContainer}>
              <Text style={styles.month}>{props.date.month.toUpperCase()}</Text>
              <Text style={styles.day}>{props.date.day}</Text>
            </View>
            { !last && <Dash style={styles.carLeftLine} dashLength={4} dashGap={3} dashColor='#979797' /> }
          </View>
          <View style={styles.cardRight}>
            <Text style={styles.cardAction}><Text style={styles.cardActionName}>You added</Text> 3 more contacts</Text>
            <View style={styles.userPhotosContainer}>
              { props.items.map((item, i) => (
                <Image key={i} style={styles.toolbarUserIcon} source={item} />
              ))}
            </View>
          </View>
        </View>
      )
    }

    default: {
      return <View />
    }
  }
}

export default ThreadDetailCard
