import React from 'react'
import { Image, ImageSourcePropType, ImageStyle, Text, TextStyle, View, ViewStyle } from 'react-native'
import Button from './LargeButton'
import { color, spacing, textStyle } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  marginTop: '33%',
  paddingHorizontal: spacing._16,
  backgroundColor: color.screen_primary
}

const IMAGE: ImageStyle = {
  marginBottom: spacing._16
}

const TITLE: TextStyle = {
  ...textStyle.header_l,
  marginBottom: spacing._8
}

const SUBTITLE: TextStyle = {
  ...textStyle.body_l,
  marginBottom: spacing._16
}

const BUTTON_WRAPPER: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignSelf: 'center'
}

interface Props {
  title: string
  subtitle?: string
  showArrow?: boolean
  buttonText?: string
  onButtonPress?: () => void
  image: ImageSourcePropType
  containerStyle?: ViewStyle
  children?: string
}

const onboardingMessage = (props: Props) => {
  return (
    <View style={[CONTAINER, props.containerStyle]}>
      <Image style={IMAGE} source={props.image} />
      <Text style={TITLE}>{props.title}</Text>
      <Text style={SUBTITLE}>{props.subtitle || props.children}</Text>
      {props.buttonText &&
        <View style={BUTTON_WRAPPER}>
          <Button text={props.buttonText} onPress={props.onButtonPress} />
        </View>
      }
    </View>
  )
}

export default onboardingMessage
