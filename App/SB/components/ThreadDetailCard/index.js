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
  const { type, last, profile } = props
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
      // format really long strings to just show a (+) to read the whole thing
      if (caption.length > 120) {
        caption = props.photo.caption.substring(0, 117)
        caption = caption.substring(0, caption.lastIndexOf(' '))
        while (caption[caption.length - 1] === '.' || caption[caption.length - 1] === ' ') {
          caption = caption.slice(0, -1)
        }
        caption += '... (+)'
      }

      const author = props.contacts.find((p) => p.id === props.photo.author_id)

      let username = 'anonymous'
      if (props.metadata && props.metadata.username && props.metadata.username !== '') {
        username = props.metadata.username
      }

      const defaultSource = require('../../views/ThreadsDetail/statics/default-profile.png')
      const src = author && author.avatar_id ? {uri: 'https://cafe.us-east-1.textile.io/ipns/' + author.avatar_id + '/avatar_id'} : defaultSource

      return (
        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <View style={styles.dateContainer}>
              <Text style={styles.month}>{dateSmall.toUpperCase()}</Text>
              <Text style={[styles.day, dateLarge === 'NOW' && styles.now]}>{dateLarge}</Text>
            </View>
            { !last && <Dash style={styles.carLeftLine} dashLength={4} dashGap={3} dashColor='#979797' /> }
          </View>
          <TouchableOpacity style={styles.cardRight} onPress={() => {
            props.onSelect(props.photo.id)
          }} >
            <Text style={styles.cardAction}><Text style={styles.cardActionName}>
              {profile.username === username ? 'You' : username}
            </Text> added a photo</Text>
            <View style={styles.cardImage}>
              <View style={styles.imageStretch}>
                <TextileImage
                  imageId={props.photo.id}
                  path={'thumb'}
                  style={styles.image}
                  resizeMode={'cover'}
                  width={270}
                  height={270}
                />
              </View>
            </View>
            <SmallIconTag syle={{flexDirection: 'row'}} text={caption} image={src} defaultSource={defaultSource}/>
          </TouchableOpacity>
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
