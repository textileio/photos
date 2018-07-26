import React from 'react'
import { View, Text, ScrollView, Dimensions, Image } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import Toolbar from '../../components/Toolbar'
import BottomDrawerList from '../../components/BottomDrawerList'
import CommentCard from '../../components/CommentCard'
import CommentBox from '../../components/CommentBox/CommentBoxContainer'

import styles from './statics/styles'
import comments from './constants'

const { width } = Dimensions.get('window')

const ThreadPhotoDetail = () => {
  const showDrawer = false // Should uncomment to display drawer

  return (
    <View style={styles.container}>
      <Toolbar
        left={<Image style={styles.toolbarLeft} source={require('./statics/icon-arrow-left.png')} />}
        right={
          <View style={styles.toolBarRight}>
            <Image style={styles.toolbarIconMore} source={require('./statics/icon-more.png')} />
          </View>
        }>
        <Text style={styles.toolbarTitle}>Summer cheers!!! </Text>
      </Toolbar>
      <ScrollView style={styles.contentContainer}>
        <ImageSc style={styles.mainPhoto} width={width} source={require('./statics/photo2.png')} />
        <View style={styles.commentsContainer}>
          { comments && comments.map((comment, i) => (
            <CommentCard key={i} {...comment} />
          ))}
        </View>
      </ScrollView>
      <CommentBox />
      { showDrawer && <BottomDrawerList /> }
    </View>
  )
}

export default ThreadPhotoDetail