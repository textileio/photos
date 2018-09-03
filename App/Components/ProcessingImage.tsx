import React, { Fragment } from 'react'
import { View, Image, Button, ViewStyle, ImageStyle, Text, TextStyle } from 'react-native'

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

const ERROR: TextStyle = {
  ...ITEM,
  ...STATUS,
  flex: 1
}

export interface IProcessingImageProps {
  imageUri: string,
  progress: number,
  message?: string,
  errorMessage?: string,
  retry?: () => void,
  cancel?: () => void
}

const ProcessingImage = (props: IProcessingImageProps) => {
  const { imageUri, progress, message, errorMessage, retry, cancel } = props

  let content: JSX.Element
  if (errorMessage) {
    content = (
      <Fragment>
        <Text style={ERROR}>{`Error: ${errorMessage}`}</Text>
        {retry && <Button title={'Retry'} onPress={retry} />}
        {cancel && <Button title={'Cancel'} onPress={cancel} />}
      </Fragment>
    )
  } else {
    content = (
      <Fragment>
        <View style={STACK}>
          <Text style={STATUS} />
          <ProgressBar progress={progress} />
          <Text style={STATUS}>{message}</Text>
        </View>
        {cancel && <Button title={'Cancel'} onPress={cancel} />}
      </Fragment>
    )
  }

  return (
    <View style={CONTAINER}>
      <Image style={IMAGE} source={{ uri: imageUri }} resizeMode={'cover'} />
      {content}
    </View>
  )
}

export default ProcessingImage
