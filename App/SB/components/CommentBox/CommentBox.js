import React from 'react'
import { View, TextInput, Text } from 'react-native'

import styles from './statics/styles'

const CommentBox = props => {
  const { keyboardHeight } = props

  return (
    <View style={[styles.commentFooter, { bottom: keyboardHeight }]}>
      <TextInput style={styles.textInput} placeholder='Write a comment...' placeholderTextColor='#4a4a4a' />
      <Text style={styles.plus}>+</Text>
    </View>
  )
}

export default CommentBox
