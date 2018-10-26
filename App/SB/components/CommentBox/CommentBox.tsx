import React from 'react'
import { View, TextInput, Text, TouchableOpacity } from 'react-native'

import Icons from '../../../Components/Icons'

import styles from './statics/styles'

interface Props {
  value: string | undefined
  onUpdate: (text: string) => void
  onSubmit: () => void
}

const CommentBox = (props: Props) => {
  const { value, onUpdate, onSubmit } = props

  return (
    <View style={styles.commentFooter}>
      <TextInput
        style={styles.textInput}
        placeholder='Write a comment...'
        placeholderTextColor='#4a4a4a'
        onChangeText={onUpdate}
        value={value}
      />
      <TouchableOpacity onPress={onSubmit} >
        <Icons name='circle-plus' color='black' size={24} />
      </TouchableOpacity>
    </View>
  )
}

export default CommentBox
