import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFCFE',
    flex: 1,
  },
  contentContainer: {},
  toolbarLeft: {
    height: 16,
    width: 40,
    marginBottom: 16
  },
  toolBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  toolbarIconMore: {
    height: 4,
    width: 16
  },
  toolbarTitle: {
    fontFamily: "BentonSans",
    fontSize: 30,
  },
  mainPhoto: {
    width: '100%'
  },
  commentsContainer: {
    paddingLeft: 16,
    paddingTop: 17,
    paddingBottom: 36
  },
})