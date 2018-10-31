import React from 'react'
import { View, Text, Image, ImageSourcePropType, ViewStyle, TextStyle, ImageStyle } from 'react-native'

import * as s from '../Themes/Constants'

const CONTAINER: ViewStyle = {
  flex: 1,
  marginTop: '16%',
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

interface Props {
  title: string
  subtitle: string
  image: ImageSourcePropType
  containerStyle?: ViewStyle
}

const onboardingMessage = (props: Props) => {
  return (
    <View style={[CONTAINER, props.containerStyle]}>
      <Image style={IMAGE} source={props.image} />
      <Text style={TITLE}>{props.title}</Text>
      <Text style={SUBTITLE}>{props.subtitle}</Text>
    </View>
  )
}

export default onboardingMessage
