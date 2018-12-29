import React from 'react'
import { Image, ImageSourcePropType, ImageStyle, Text, TextStyle, View, ViewStyle } from 'react-native'
import * as s from '../Themes/Constants'
import Button from './Button'

const CONTAINER: ViewStyle = {
  flex: 1,
  marginTop: '33%',
  paddingHorizontal: s.MARGIN_STANDARD,
  backgroundColor: s.COLOR_BACKGROUND_PRIMARY
}

const IMAGE: ImageStyle = {
  marginBottom: s.ITEM_SPACING_LARGE
}

const TITLE: TextStyle = {
  ...s.H2,
  marginBottom: s.ITEM_SPACING_REGULAR
}

const SUBTITLE: TextStyle = {
  ...s.H1,
  marginBottom: s.ITEM_SPACING_LARGE
}

const BUTTON_WRAPPER: ViewStyle = {
  flex: 1,
  justifyContent: 'center'
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
