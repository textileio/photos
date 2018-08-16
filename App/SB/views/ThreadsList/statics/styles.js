import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    backgroundColor: '#FAFCFE',
    flex: 1,
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
    marginHorizontal: 4,
    position: 'absolute',
    // ensure the flatlist spreads the whole container
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  emptyStateContainer: {
    backgroundColor: '#FAFCFE',
    paddingTop: 75,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100
  },
  emptyStateImage: {
    width: 159,
    height: 146,
    marginBottom: 16
  },
  emptyStateText: {
    fontFamily: 'BentonSans',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    paddingHorizontal: 52,
    marginBottom: 24
  }
})
