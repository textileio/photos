import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    marginTop: 0,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    backgroundColor: '#FAFCFE',
    flex: 1
  },
  threadDetail: {
    paddingHorizontal: 4,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  imageList: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
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
