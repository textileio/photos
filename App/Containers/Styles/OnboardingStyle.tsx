import { StyleSheet, ImageStyle, ViewStyle, TextStyle } from 'react-native'

import { color } from '../../styles'

export default StyleSheet.create({
  emptyStateContainer: {
    backgroundColor: color.screen_primary,
    paddingTop: 75,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100
  } as ViewStyle,
  emptyStateImage: {
    width: 159,
    height: 146,
    marginBottom: 16
  } as ImageStyle,
  emptyStateImage2: {
    width: 230,
    height: 151,
    marginBottom: 16
  } as ImageStyle,
  emptyStateImage3: {
    width: 300,
    height: 222,
    marginBottom: 16
  } as ImageStyle,
  emptyStateText: {
    fontFamily: 'Biotif-Regular',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    paddingHorizontal: 22,
    marginBottom: 24
  } as TextStyle
})
