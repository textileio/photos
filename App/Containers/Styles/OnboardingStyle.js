import { StyleSheet } from 'react-native'

export default StyleSheet.create({
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
  emptyStateImage2: {
    width: 307,
    height: 201,
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
