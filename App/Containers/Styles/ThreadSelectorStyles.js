import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCFE'
  },
  toolbarLogo: {
    width: 82.5,
    height: 23
  },
  toolbarIcon: {
    width: 24,
    height: 24
  },
  contentContainer: {
    marginTop: 0,
    marginHorizontal: 1,
    position: 'absolute',
    // ensure the flatlist spreads the whole container
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
})
