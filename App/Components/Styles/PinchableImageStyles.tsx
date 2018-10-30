import { Dimensions, StyleSheet, Platform, ViewStyle } from 'react-native'

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    overflow: 'hidden',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  } as ViewStyle,
  pinchableImage: {
    width: 250,
    height: 250
  } as ViewStyle,
  wrapper: {
    flex: 1
  } as ViewStyle
})
