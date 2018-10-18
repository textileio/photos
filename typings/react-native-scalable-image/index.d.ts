declare module 'react-native-scalable-image' {
  import React from 'react'
  import { StyleProp, ImageProps, ViewStyle, TextStyle } from 'react-native'

  export interface ScalableImageProps extends ImageProps {
    height?: number
    width?: number,
    background?: boolean
    onPress?: () => void
    onSize?: (size: { width: number, height: number }) => void
  }

  export default class ScalableImage extends React.Component<ScalableImageProps> {}
}
