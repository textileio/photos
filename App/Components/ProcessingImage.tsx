import React from 'react'
import { View, Image, ViewStyle, ImageStyle, FlexStyle } from 'react-native'

import ProgressBar from './ProgressBar'

const CONTAINER: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: 80,
  marginBottom: 10
}

const ITEM = {
  marginLeft: 8
}

const LAST_ITEM = {
  marginRight: 8
}

const IMAGE: ImageStyle = {
  ...ITEM,
  width: 80,
  height: 80
}

const PROGRESS: ViewStyle = {
  ...ITEM,
  ...LAST_ITEM
}

export type ProcessingImageProps = {
  imageUri: string,
  progress: number,
  retry: () => void,
  cancel: () => void
}

const ProcessingImage = (props: ProcessingImageProps) => {
  const { imageUri, progress } = props
  return (
    <View style={CONTAINER}>
      <Image style={IMAGE} source={{uri: imageUri}} resizeMode='cover' />
      <ProgressBar progress={progress} style={PROGRESS} />
    </View>
  )
}

export default ProcessingImage