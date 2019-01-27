import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import Icon from '@textile/react-native-icon'

import styles from './statics/styles'

interface Props {
  value: string | undefined
  showError?: boolean
  onUpdate: (text: string) => void
  onSubmit: () => void
}

const CommentBox = (props: Props) => {
  const { value, onUpdate, onSubmit, showError } = props

  // subtle way to just indicat that a submission error occurred
  const iconColor = showError ? 'red' : 'black'

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
        <Icon name='circle-plus' color={iconColor} size={24} />
      </TouchableOpacity>
    </View>
  )
}

export default CommentBox
