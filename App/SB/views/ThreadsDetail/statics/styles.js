import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    marginTop: 0,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    backgroundColor: '#FAFCFE',
    flex: 1
  },
  threadsDetail: {
    paddingTop: 22,
    paddingHorizontal: 4
  },
  toolbarTitle: {
    fontFamily: 'BentonSans',
    fontSize: 30,
    marginBottom: 10,
    paddingLeft: 8
  },
  imageList: {
    paddingTop: 22,
    paddingHorizontal: 0,
    marginHorizontal: 0
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
  toolbarUserContainer: {
    flexDirection: 'row'
  },
  toolbarUserIcon: {
    height: 27,
    width: 27,
    marginRight: 10
  }
})
