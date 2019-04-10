import { StyleSheet, ImageStyle, ViewStyle, TextStyle } from 'react-native'

import { color } from '../../../../styles'

interface Styles {
  container: ViewStyle
  header: ViewStyle
  title: TextStyle
  closeIconPadding: ViewStyle
  closeIcon: ImageStyle
  listContainer: ViewStyle
  row: ViewStyle
  photoElement: ViewStyle
}

export default StyleSheet.create<Styles>({
  container: {
    paddingHorizontal: 10,
    paddingTop: 3,
    // marginTop: 100, // <- changed because headers will be outside of Containers now...
    backgroundColor: color.screen_primary,
    position: 'absolute',
    height: 300,
    bottom: 0,
    left: 0,
    right: 0
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderColor: '#E1E1E1',
    borderBottomWidth: 1
  },
  title: {
    fontFamily: 'Biotif-Regular',
    fontSize: 14,
    color: '#9b9b9b'
  },
  closeIconPadding: {
    paddingHorizontal: 15
  },
  closeIcon: {
    paddingBottom: 16,
    width: 13,
    height: 13
  } as ImageStyle,
  listContainer: {
    paddingBottom: 22
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 44,
    paddingVertical: 24
  },
  photoElement: {
    marginTop: 10,
    marginBottom: 0
  }
})
