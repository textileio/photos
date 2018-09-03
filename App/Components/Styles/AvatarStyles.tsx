import { StyleSheet, ViewStyle } from 'react-native'

export default StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  } as ViewStyle,
  stretch: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  } as ViewStyle
})
