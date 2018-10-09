import React from 'react'
import { View, Image, Button, ViewStyle, ImageStyle, Text, TextStyle, TouchableOpacity } from 'react-native'

import ProgressBar from './ProgressBar'

const CONTAINER: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center'
}

const IMAGE: ImageStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  opacity: 0.2
}

const STACK: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'center',
  alignSelf: 'center',
  paddingHorizontal: 16
}

const STATUS: TextStyle = {
  fontFamily: 'BentonSans',
  fontSize: 10,
  color: 'rgb(185, 185, 185)',
  textAlign: 'center',
  marginTop: 3,
  marginBottom: 3
}

const BUTTON: TextStyle = {
  fontFamily: 'BentonSans',
  fontSize: 16,
  color: 'rgb(95, 95, 255)',
  textAlign: 'center',
  marginVertical: 10
}

export interface IProcessingWalletImageProps {
  imageUri: string,
  progress: number,
  message?: string,
  errorMessage?: string,
  retry?: () => void,
  cancel?: () => void,
  displayError?: (errorMessage: string) => void
  height: number
  width: number
}

const ProcessingWalletImage = (props: IProcessingWalletImageProps) => {
  const { imageUri, progress, message, errorMessage, cancel, displayError, width, height } = props

  let content: JSX.Element
  if (errorMessage) {
    content = (
      <View style={STACK}>
        {displayError && <TouchableOpacity onPress={()=>{displayError && displayError(errorMessage)}}><Text style={BUTTON}>error</Text></TouchableOpacity>}
        {cancel && <TouchableOpacity onPress={cancel}><Text style={BUTTON}>cancel</Text></TouchableOpacity>}
      </View>
    )
  } else {
    content = (
      <View style={STACK}>
        <Text style={STATUS} />
        <ProgressBar progress={progress} />
        <Text style={STATUS}>{message}</Text>
        {cancel && <TouchableOpacity onPress={cancel}><Text style={BUTTON}>cancel</Text></TouchableOpacity>}
      </View>
    )
  }

  return (
    <View style={CONTAINER}>
      <Image style={{...IMAGE, width, height}} source={{ uri: imageUri }} resizeMode={'cover'} />
      {content}
    </View>
  )
}

export default ProcessingWalletImage
