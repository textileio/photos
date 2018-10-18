declare module 'react-native-easy-toast' {
  import React from 'react'
  import { StyleProp, ViewStyle, TextStyle } from 'react-native'

  export interface EasyToastProps {
    style?: StyleProp<ViewStyle>,
    position: 'top' | 'center' | 'bottom',
    textStyle?: StyleProp<TextStyle>,
    positionValue?: number,
    fadeInDuration?: number,
    fadeOutDuration?: number,
    opacity?: number
  }

  export default class EasyToast extends React.Component<EasyToastProps> {
    show(text: string, duration?: number, callback?: () => void): void
  }
}
