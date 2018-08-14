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
    marginTop: 25,
    marginHorizontal: 15
  },
  emptyStateContainer: {
    paddingTop: 75,
    alignItems: 'center'
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
