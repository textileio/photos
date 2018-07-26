import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFCFE',
    flex: 1
  },
  contentContainer: {
    paddingTop: 22,
    paddingHorizontal: 24
  },
  toolbarLeft: {
    height: 16,
    width: 40
  },
  toolBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  toolbarIconPhoto: {
    height: 24,
    width: 27,
    marginRight: 16
  },
  toolbarIconMore: {
    height: 4,
    width: 16
  },
  toolbarTitle: {
    fontFamily: 'BentonSans',
    fontSize: 30,
    marginBottom: 10
  },
  toolbarUserContainer: {
    flexDirection: 'row'
  },
  toolbarUserIcon: {
    height: 27,
    width: 27,
    marginRight: 10
  }
})