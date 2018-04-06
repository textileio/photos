import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes/'

export default StyleSheet.create({
  header: {
    // Styles the screen header in Textile Photos feed view
    backgroundColor: Colors.transparent,
    // below allows our image stream to go under our header
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  title: {
    // Top center bar text. Currently set in PhotosNavigation
    color: Colors.transparent
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
