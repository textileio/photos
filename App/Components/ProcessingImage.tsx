import React from 'react'
import { View, Image, ViewStyle, ImageStyle, Text, TextStyle } from 'react-native'

import ProgressBar from './ProgressBar'

const CONTAINER: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: 80,
  marginBottom: 10
}

const ITEM = {
  marginLeft: 12
}

const LAST_ITEM = {
  marginRight: 12
}

const IMAGE: ImageStyle = {
  ...ITEM,
  width: 80,
  height: 80
}

const STACK: ViewStyle = {
  ...ITEM,
  ...LAST_ITEM,
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'stretch'
}

const STATUS: TextStyle = {
  fontFamily: 'BentonSans',
  fontSize: 12,
  color: 'rgb(185, 185, 185)',
  textAlign: 'center',
  marginTop: 6,
  marginBottom: 6
}

export type ProcessingImageProps = {
  imageUri: string,
  progress: number,
  message?: string,
  retry: () => void,
  cancel: () => void
}

const ProcessingImage = (props: ProcessingImageProps) => {
  const { imageUri, progress, message } = props
  return (
    <View style={CONTAINER}>
      <Image style={IMAGE} source={{uri: imageUri}} resizeMode='cover' />
      <View style={STACK}>
        <Text style={STATUS} />
        <ProgressBar progress={progress} />
        <Text style={STATUS}>{message}</Text>
      </View>
    </View>
  )
}

export default ProcessingImage