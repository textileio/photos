import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes/'

export const headerTintColor = Colors.snow

export default StyleSheet.create({
  header: {
    // Styles the screen header in Textile Photos feed view
    backgroundColor: Colors.brandBlue
  },
  headerTitle: {
    fontFamily: 'Biotif-Medium',
    color: Colors.snow
  },
  icon: {
    color: Colors.transparent
  },
  tabStyle: {
    backgroundColor: Colors.transparent,
    borderTopWidth: 0,
    borderTopColor: 'white',
    position: 'absolute',
    paddingBottom: 8,
    bottom: 0,
    left: 0,
    right: 0
  }
})
