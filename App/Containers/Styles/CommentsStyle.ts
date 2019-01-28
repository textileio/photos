import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  safeContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  container: {
    marginTop: 0, // <- Removed until header gets reworked, orig = 20
    backgroundColor: '#FAFCFE',
    flex: 1
  },
  contentContainer: {},
  toolbarLeft: {
    marginTop: 0,
    height: 16,
    width: 40
  },
  toolBarRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  toolbarIconMore: {
    height: 4,
    width: 16
  },
  toolbarTitle: {
    fontFamily: 'Biotif-Regular',
    fontSize: 30
  },
  backButtonWrapper: {
    paddingVertical: 5
  },
  mainPhoto: {
    width: '100%'
  }
})
