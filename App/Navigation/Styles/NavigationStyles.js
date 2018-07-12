import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes/'

export const headerTintColor = Colors.snow

export default StyleSheet.create({
  header: {
    // Styles the screen header in Textile Photos feed view
    backgroundColor: Colors.brandBlue
  },
  headerTitleImage: {
    marginHorizontal: 16
  },
  headerTitle: {
    fontFamily: 'Biotif-Medium',
    color: Colors.snow
  },
  headerButton: {
    fontFamily: 'Biotif-Regular',
    color: Colors.snow,
    fontSize: 17
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
