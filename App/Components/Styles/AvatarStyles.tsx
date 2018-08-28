import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes/'

export const headerTintColor = Colors.charcoal

export default StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center'
  },
  stretch: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
})
