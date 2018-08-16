import React from 'react'
import { View, Text, Image, Dimensions } from 'react-native'
import Dash from 'react-native-dash'
import moment from 'moment'
import SmallIconTag from '../SmallIconTag'
import TextileImage from '../../../../TextileImage'
import { getHeight } from '../../../Services/PhotoUtils'

import styles from './statics/styles'

const WIDTH = Dimensions.get('window').width

const ThreadDetailCard = props => {
  const { last, profile, item } = props
  const type = item.type
  switch (type) {
    case 'title': {
      // TODO: We should do this with Navbar integration later
      return (
        <Text style={styles.titleCard}>{item.name}</Text>
      )
    }
    case 'photo': {
      const photo = item.photo
      const date = moment(photo.date)
      const dateString = date.fromNow()

      const username = photo.username ? photo.username : photo.author_id.substring(0, 8).toUpperCase()

      // Unsquares the images by maintaining the aspect ratio no matter device size
      let imageWidth = WIDTH
      const heightProperties = getHeight(photo.metadata, imageWidth)
      const imageHeight = heightProperties.height

      const defaultSource = require('../../views/Settings/statics/main-image.png')
      let uri = photo.author_id ? 'https://cafe.us-east-1.textile.io/ipns/' + photo.author_id + '/avatar' : undefined
      // ensure we have the user's latest avatar even if the cafe is still caching
      if (props.profile && props.profile.id && props.profile.id === photo.author_id) {
        uri = 'https://cafe.us-east-1.textile.io' + props.profile.avatar_id
      }
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader} >
            <View style={styles.cardHeaderLeft} >
              <Text style={styles.cardAction}><Text style={styles.cardActionName}>
                {profile.username === username ? 'You' : username}
              </Text> added a photo</Text>
            </View>
            <View style={styles.cardHeaderRight} >
              <Text style={styles.detailUpdateTime}>{dateString}</Text>
            </View>
          </View>
          <View style={[styles.cardImage, {width: imageWidth, height: imageHeight}]}>
            <View style={styles.imageStretch}>
              <TextileImage
                imageId={photo.id}
                path={'small'}
                style={[styles.image, {width: imageWidth, height: imageHeight}]}
                resizeMode={'cover'}
                width={imageWidth}
                height={imageHeight}
              />
            </View>
          </View>
          <SmallIconTag syle={{flexDirection: 'row'}} text={photo.caption} uri={uri} defaultSource={defaultSource} avatarStyle={{marginRight: 10, marginLeft: 8}} />
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
      return (<View />)
    }
  }
}

export default ThreadDetailCard
